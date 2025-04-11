import { createSession } from "@/lib/actions/session";
import { OTP, User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

type IFormData = {
  name: string;
  email: string;
  username: string;
  password: string;
};
export async function POST(req: NextRequest) {
  const { name, email, username, password } = (await req.json()) as IFormData;

  try {
    const newUser = new User({
      name,
      username,
      email,
      password,
    });

    await Promise.all([
      newUser.save(),
      OTP.deleteOne({ email }),
      createSession({ userId: newUser.id, username }),
    ]);

    return NextResponse.json(
      { success: true, message: "User Created Successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log("[CREATE_USER_API_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Error Creating new user, try again" },
      { status: 500 },
    );
  }
}
