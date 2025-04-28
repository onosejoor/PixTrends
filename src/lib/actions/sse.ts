"use server";

import { verifySession } from "./session";

const SSE_URL = process.env.SSE_URL!;

export async function checkSSE() {
  try {
    const { userId, isAuth } = await verifySession();
    if (!isAuth) {
      return { success: false, message: "unauthorised", code: 401 };
    }
    return { success: true, code: 200, url: `${SSE_URL}/${userId}` };
  } catch (error) {
    console.log("[GET_SSE_URL_ERROR]: ", error);
    return { success: false, message: "Internal error", code: 500 };
  }
}
