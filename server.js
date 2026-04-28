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
        await mongoose.connect(uri, { bufferCommands: false });
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
        const doc = await Message.create(data);
        return doc.toObject();
    }
    // Fallback: in-memory
    if (!inMemoryMessages[data.communityId]) {
        inMemoryMessages[data.communityId] = [];
    }
    const msg = { _id: Date.now().toString(), ...data, createdAt: new Date() };
    inMemoryMessages[data.communityId].push(msg);
    return msg;
}

async function getMessages(communityId, limit = 50) {
    if (dbConnected && Message) {
        return await Message.find({ communityId })
            .sort({ createdAt: 1 })
            .limit(limit)
            .lean();
    }
    return (inMemoryMessages[communityId] || []).slice(-limit);
}

// ── Application Schema (for membership checks) ──
const applicationSchema = new mongoose.Schema({
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    userId: String,
    status: String,
}, { strict: false });

let Application;

async function checkMembership(communityId, userId) {
    if (dbConnected) {
        if (!Application) {
            Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
        }
        const app = await Application.findOne({ communityId, userId, status: 'approved' });
        return !!app;
    }
    // Fallback: allow all for testing
    return true;
}

// ── Room Users Tracking ──
const roomUsers = {}; // { communityId: Map<socketId, { userName, userId }> }

// ── Boot ──
app.prepare().then(async () => {
    await connectDB();

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

        // ── Join a community chat room ──
        socket.on('join-room', async ({ communityId, userName, userId }) => {
            // Verify membership
            const isMember = await checkMembership(communityId, userId);
            if (!isMember) {
                socket.emit('error-msg', { message: 'You are not a member of this community.' });
                return;
            }

            socket.join(communityId);
            socket.data = { communityId, userName, userId };

            // Track online users
            if (!roomUsers[communityId]) roomUsers[communityId] = new Map();
            roomUsers[communityId].set(socket.id, { userName, userId });

            // Send message history
            const messages = await getMessages(communityId);
            socket.emit('message-history', messages);

            // Broadcast online users list
            const users = Array.from(roomUsers[communityId].values());
            io.to(communityId).emit('room-users', users);

            // Notify room
            socket.to(communityId).emit('user-joined', { userName });
        });

        // ── Send a message ──
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

        // ── Typing indicators ──
        socket.on('typing', ({ communityId, userName }) => {
            socket.to(communityId).emit('user-typing', { userName });
        });

        socket.on('stop-typing', ({ communityId }) => {
            socket.to(communityId).emit('user-stop-typing', { userName: socket.data?.userName });
        });

        // ── Disconnect ──
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
