"use server";

import { Job, Queue, Worker } from "bullmq";
import { createTransport, SendMailOptions } from "nodemailer";
import { OTP, User } from "../models";
import { generate } from "otp-generator";
import connectDB from "../db";
import redisClient from "@/redis.config";

if (!global.mongoose) {
  await connectDB();
}

const EMAIL_USER = process.env.EMAIL_USER!;
const APP_PASSWORD = process.env.APP_PASSWORD!;

type Props = {
  email: string;
  otp: string;
  isResend: boolean;
};

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: APP_PASSWORD,
  },
});

const otpQueue = new Queue("otp-queue", {
  connection: redisClient,
});

const otpWorker = new Worker<Props>(
  "otp-queue",
  async (job: Job<Props>) => {
    const { email, otp, isResend } = job.data;

    try {
      const mailOptions: SendMailOptions = {
        from: `PixTrends<${EMAIL_USER}>`,
        to: email,
        subject: "OTP Verification from Pixtrends",
        html: generateOTPTemplate(otp),
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP ${isResend ? "resent" : "sent"} to ${email}`);
    } catch (error) {
      console.error(`Failed to send OTP to ${email}:`, error);
      throw error;
    }
  },
  {
    connection: redisClient,
    concurrency: 5,
    limiter: {
      max: 30,
      duration: 60000,
    },
  },
);

const generateAndSaveOTP = async (email: string) => {
  const otp = generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: Date.now() },
    { upsert: true, new: true },
  );

  return otp;
};

export async function sendOTP(email: string, username: string) {
  try {
    const [userExists, usernameTaken] = await Promise.all([
      User.exists({ email }),
      User.exists({ username }),
    ]);

    if (userExists) return { success: false, message: "User already exists" };
    if (usernameTaken) return { success: false, message: "Username taken" };

    const otp = await generateAndSaveOTP(email);

    await otpQueue.add("send-otp", {
      email,
      otp,
      username,
      isResend: false,
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("[SEND_OTP_ERROR]:", error);
    return { success: false, message: "Error sending OTP" };
  }
}

export async function resendOtp(email: string) {
  try {
    const otp = await generateAndSaveOTP(email);

    await otpQueue.add("send-otp", {
      email,
      otp,
      isResend: true,
    });

    return { success: true, message: "OTP resent successfully" };
  } catch (error) {
    console.error("[RESEND_OTP_ERROR]:", error);
    return { success: false, message: "Error resending OTP" };
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return { success: false, message: "Invalid OTP" };

    if (otpRecord.otp !== otp) {
      return { success: false, message: "Incorrect OTP" };
    }

    await otpRecord.deleteOne();
    return { success: true, message: "OTP verified" };
  } catch (error) {
    console.error("[VERIFY_OTP_ERROR]:", error);
    return { success: false, message: "Error verifying OTP" };
  }
}

otpWorker.on("failed", (job, err) => {
  console.error(`OTP email failed after retries for ${job?.data.email}:`, err);
});

function generateOTPTemplate(otp: string) {
  return `
       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <h1 style="color: #4CAF50; margin: 0;">Your Verification Code</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p style="font-size: 16px; margin: 0;">Hello,</p>
                            <p style="font-size: 16px; margin: 10px 0;">Use the code below to verify your email address:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <div style="display: inline-block; background-color: #f1f1f1; border-radius: 5px; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #333;">
                             ${otp}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p style="font-size: 14px; color: #666; margin: 0;">This code will expire in 5 minutes. If you didn’t request this, please ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <p style="font-size: 14px; margin: 0;">Thank you,<br>PixTrends Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table> `;
}
