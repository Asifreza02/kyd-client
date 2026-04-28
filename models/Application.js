import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
    },
    userId: {
        type: String, // from the session
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
