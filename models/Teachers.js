import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  title : { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone : { type: String, required: true },
  office : { type: String, required: true },
  research: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  initials: { type: String, required: true },
  department: { type: String, required: true },
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
