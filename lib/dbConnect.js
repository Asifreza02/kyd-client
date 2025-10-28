import mongoose from "mongoose";


let globalWithMongoose = global;
let cached = globalWithMongoose._mongooseConn;
if (!cached) {
  cached = globalWithMongoose._mongooseConn = { conn: null, promise: null };
}


export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};