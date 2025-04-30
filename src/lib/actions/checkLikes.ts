"use server";

import { Like } from "../models";
import { verifySession } from "./session";

export async function checkIsLiked(postId: string) {
  const { userId } = await verifySession();

  const isLiked = await Like.exists({ post: postId, user: userId });

  return !!isLiked;
}
