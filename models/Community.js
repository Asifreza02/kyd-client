import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this community.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    lead: {
        type: String,
        required: [true, 'Please provide the name of the community lead'],
    },
    leaderId: {
        type: String,
        required: [true, 'Please provide the user ID of the community lead'],
    },
    managers: {
        type: [String],
        default: [],
    },
    members: {
        type: [String],
        default: [],
    },
    memberCount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    image: {
        type: String,
        default: 'https://picsum.photos/seed/community/600/400',
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

export default mongoose.models.Community || mongoose.model('Community', CommunitySchema);
