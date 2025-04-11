import "server-only";
import { ObjectId } from "mongoose";
import { decrypt, encrypt } from "./jwt";
import { cookies } from "next/headers";

type SessionPayload = {
  userId: ObjectId | string;
  username?: string;
  expiresAt?: Date;
};

export async function createSession({ userId, username }: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({ userId, username, expiresAt });

  const cookie = await cookies();

  cookie.set("pixtrends_session", session, {
    httpOnly: true,
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
}

export async function veryfySession() {
  const cookie = (await cookies()).get("pixtrends_session")?.value;

  if (!cookie) return { isAuth: false, message: "user not authenticated" };

  const session = await decrypt(cookie);

  if (!session?.userId)
    return { isAuth: false, message: "user not authenticated" };

  return { isAuth: true, userId: session.userId, username: session.username };
}
