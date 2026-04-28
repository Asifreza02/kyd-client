import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '' },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Others' },
    image: { type: String, default: '' },
    organizer: { type: String, default: '' },
    registrationLink: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
    submittedBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
