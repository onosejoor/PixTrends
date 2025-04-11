import { createSession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type IFormData = {
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as IFormData;

    const getUser = await User.findOne({ email });

    if (!getUser) {
      return NextResponse.json(
        {
          success: false,
          message: `email: ${email} is not registered on PixTrends`,
        },
        { status: 404 },
      );
    }

    const comparePasswords = await bcrypt.compare(password, getUser.password);

    if (!comparePasswords) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 400 },
      );
    }

    await createSession({ userId: getUser.id, username: getUser.username });
    return NextResponse.json(
        {
          success: true,
          message: `Welcome ${getUser.username}`,
        },
        { status: 200 },
      );
  } catch (error) {
    console.log("[SIGNIN_USER_API_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Error, try again" },
      { status: 500 },
    );
  }
}
