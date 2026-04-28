import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true },
  title : { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone : { type: String, default: 'N/A' },
  office : { type: String, default: 'N/A' },
  research: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  initials: { type: String, default: '' },
  department: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
