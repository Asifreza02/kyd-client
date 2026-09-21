const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// ── Message Schema (inline to avoid ESM/CJS conflicts with Next.js models) ──
const messageSchema = new mongoose.Schema({
    communityId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 2000 },
}, { timestamps: true });

messageSchema.index({ communityId: 1, createdAt: 1 });

let Message;
let dbConnected = false;

// In-memory fallback for messages when MongoDB is unavailable
const inMemoryMessages = {};

// ── Database Connection ──
async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('Missing MONGODB_URI');
        await mongoose.connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 2500 // Fast 2.5s timeout
        });
        Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
        dbConnected = true;
        console.log('✅ Socket server: MongoDB connected');
    } catch (err) {
        console.warn('⚠️  Socket server: MongoDB unavailable, using in-memory storage');
        dbConnected = false;
    }
}

// ── Message Persistence ──
async function saveMessage(data) {
    if (dbConnected && Message) {
        try {
            const doc = await Message.create(data);
            return doc.toObject();
        } catch (e) {
            console.warn('Failed to save message to DB, falling back to memory');
        }
    }
    if (!inMemoryMessages[data.communityId]) {
        inMemoryMessages[data.communityId] = [];
    }
    const msg = { _id: Date.now().toString(), ...data, createdAt: new Date() };
    inMemoryMessages[data.communityId].push(msg);
    return msg;
}

async function getMessages(communityId, limit = 50) {
    if (dbConnected && Message) {
        try {
            return await Message.find({ communityId })
                .sort({ createdAt: 1 })
                .limit(limit)
                .lean();
        } catch (e) {
            console.warn('Failed to get messages from DB, falling back to memory');
        }
    }
    return (inMemoryMessages[communityId] || []).slice(-limit);
}

// ── Application Schema (for membership checks) ──
const communitySchemaLite = new mongoose.Schema({
    members: [String],
    managers: [String],
    leaderId: String
}, { strict: false });

let CommunityLite;

async function checkMembership(communityId, userId) {
    if (dbConnected) {
        try {
            if (!CommunityLite) {
                CommunityLite = mongoose.models.Community || mongoose.model('Community', communitySchemaLite);
            }
            const community = await CommunityLite.findById(communityId).lean();
            if (community) {
                if (community.leaderId === userId) return true;
                if (community.managers && community.managers.includes(userId)) return true;
                if (community.members && community.members.includes(userId)) return true;
            }
            return false;
        } catch (e) {
            return true;
        }
    }
    return true;
}

// ── Room Users Tracking ──
const roomUsers = {};

// ── Boot ──
app.prepare().then(() => {
    // Attempt DB connection in background without blocking server startup
    connectDB().catch(() => {});

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        cors: { origin: '*' },
        path: '/socket.io',
    });

    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);

        socket.on('join-room', async ({ communityId, userName, userId }) => {
            const isMember = await checkMembership(communityId, userId);
            if (!isMember) {
                socket.emit('error-msg', { message: 'You are not a member of this community.' });
                return;
            }

            socket.join(communityId);
            socket.data = { communityId, userName, userId };

            if (!roomUsers[communityId]) roomUsers[communityId] = new Map();
            roomUsers[communityId].set(socket.id, { userName, userId });

            const messages = await getMessages(communityId);
            socket.emit('message-history', messages);

            const users = Array.from(roomUsers[communityId].values());
            io.to(communityId).emit('room-users', users);

            socket.to(communityId).emit('user-joined', { userName });
        });

        socket.on('send-message', async ({ communityId, text, userId, userName }) => {
            if (!text || !text.trim()) return;
            const message = await saveMessage({
                communityId,
                userId,
                userName,
                text: text.trim(),
            });
            io.to(communityId).emit('new-message', message);
        });

        socket.on('typing', ({ communityId, userName }) => {
            socket.to(communityId).emit('user-typing', { userName });
        });

        socket.on('stop-typing', ({ communityId }) => {
            socket.to(communityId).emit('user-stop-typing', { userName: socket.data?.userName });
        });

        socket.on('disconnect', () => {
            const { communityId, userName } = socket.data || {};
            if (communityId && roomUsers[communityId]) {
                roomUsers[communityId].delete(socket.id);
                const users = Array.from(roomUsers[communityId].values());
                io.to(communityId).emit('room-users', users);
                socket.to(communityId).emit('user-left', { userName });
            }
            console.log('🔌 Client disconnected:', socket.id);
        });
    });

    server.listen(port, () => {
        console.log(`\n  ▲ Ready on http://${hostname}:${port}\n  ⚡ Socket.io enabled\n`);
    });
});
