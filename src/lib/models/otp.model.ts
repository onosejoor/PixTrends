import mongoose, { Model, model, Schema } from "mongoose";

interface IOtp {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, unique: true, expires: "5m" },
    otp: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
);

const OTP: Model<IOtp> = mongoose.models?.OTP || model<IOtp>("OTP", otpSchema);

export default OTP;
