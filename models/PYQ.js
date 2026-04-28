import mongoose from 'mongoose';

const PYQSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
    submittedBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.PYQ || mongoose.model('PYQ', PYQSchema);
