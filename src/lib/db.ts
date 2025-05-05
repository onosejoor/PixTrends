import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
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
    };
    cached_connection.promise = mongoose
      .connect(MONGODB_URI, opts)
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
