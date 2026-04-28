import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
}, { timestamps: true });

// Compound index for efficient queries
MessageSchema.index({ communityId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
