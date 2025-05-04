import mongoose, { Model, model, Schema } from "mongoose";

interface IOtp {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: "5m", default: Date.now },
});

const OTP: Model<IOtp> = mongoose.models?.OTP || model<IOtp>("OTP", otpSchema);

export default OTP;
