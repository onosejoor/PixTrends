import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";

if (!MONGODB_URL) {
  throw new Error("No MongoDB url is provided in the .env file!");
}

let cached_connection = global.mongoose;

if (!cached_connection) {
  cached_connection = global.mongoose = { promise: null, conn: null };
}

export default async function connectDB() {
  if (cached_connection.conn) {
    return cached_connection.conn;
  }
  if (!cached_connection.promise) {
    const opts = {
      bufferCommands: true,
      bufferTimeoutMS: 30000,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };
    cached_connection.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then((mongoose) => {
        console.log("MongoDB connected!");
        return mongoose;
      });
  }
  try {
    cached_connection.conn = await cached_connection.promise;
  } catch (e) {
    cached_connection.promise = null;
    throw e;
  }

  return cached_connection.conn;
}
