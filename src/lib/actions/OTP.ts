"use server";

import { createTransport, SendMailOptions } from "nodemailer";
import { OTP, User } from "../models";
import { generate } from "otp-generator";
import connectDB from "../db";

if (!global.mongoose) {
  await connectDB();
}

const EMAIL_USER = process.env.EMAIL_USER!;
const APP_PASSWORD = process.env.APP_PASSWORD!;

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: APP_PASSWORD,
  },
});

export async function sendOTP(email: string, username: string) {
  try {
    const [checkUser, checkUserName] = await Promise.all([
      User.exists({ email }),
      User.exists({ username }),
    ]);

    if (checkUser) {
      return { success: false, message: "user already exists" };
    }

    if (checkUserName) {
      return { success: false, message: "username already exists" };
    }

    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const mailOptions: SendMailOptions = {
      from: `PixTrends<${EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification from Pixtrends",
      text: `Your OTP is ${otp}, expires in 5mins`,
      html: `
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
    </table> `,
    };

    await OTP.findOneAndUpdate(
      { email },
      {
        otp,
      },
      { upsert: true, new: true },
    );

    await transporter.sendMail(mailOptions);

    return { success: true, message: "OTP Sent successfully" };
  } catch (error) {
    console.log("[SEND_OTP_ERROR]:", error);

    return { success: false, message: "Error sending OTP, try again" };
  }
}

export async function resendOtp(email: string) {
  try {
    const checkOtp = await OTP.findOne({ email });

    if (checkOtp) {
      await checkOtp.deleteOne();
    }
    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const mailOptions: SendMailOptions = {
      from: `PixTrends<${EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification from Pixtrends",
      text: `Your OTP is ${otp}, expires in 5mins`,
      html: `
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
        </table> `,
    };

    const newOtp = new OTP({
      email,
      otp,
    });
    await newOtp.save();

    await transporter.sendMail(mailOptions);

    return { success: true, message: "OTP resent successfully" };
  } catch (error) {
    console.log("[RESEND_OTP_ERROR]:", error);

    return { success: false, message: "Error resending OTP, try again" };
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const checkOtp = await OTP.findOne({ email });

    if (!checkOtp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (checkOtp.otp !== otp) {
      return { success: false, message: "incorrect OTP" };
    }

    await checkOtp.deleteOne();

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.log("[VERIFY_OTP_ERROR]:", error);

    return { success: false, message: "Error verifying OTP, try again" };
  }
}
