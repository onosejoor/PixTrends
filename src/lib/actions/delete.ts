"use server";

import { deleteSession } from "./session";

export async function logout() {
  await deleteSession();
}
