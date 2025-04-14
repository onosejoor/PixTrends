import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { ObjectId } from "mongoose";

type SessionPayload = {
  userId: ObjectId | string;
  username?: string;
  expiresAt?: Date;
};

const secretKey = process.env.SESSION_SECRET!;
const encodedkey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(encodedkey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedkey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.log(error);
  }
}
