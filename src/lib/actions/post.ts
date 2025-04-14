"use server";

import { Types } from "mongoose";
import { Post } from "../models";
import { veryfySession } from "./session";

export async function likePost(postId: string) {
  try {
    const { isAuth, userId } = await veryfySession();

    if (!isAuth) {
      return { success: false, message: "Unauthorized!" };
    }

    const findPost = await Post.findById(postId);

    if (!findPost) {
      return { success: false, message: "No Post found!" };
    }

    const isLiked = findPost?.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      findPost.likes = findPost.likes.filter((id) => id.toString() !== userId);
      await findPost.save();
      return { success: true, message: "Like removed!" };
    } else {
      findPost.likes.push(userId! as Types.ObjectId);
      await findPost.save();
      return { success: true, message: "Post liked!" };
    }
  } catch (error) {
    console.log("[POST_LIKE_ERROR]: ", error);
    return { success: false, message: "Error liking post" };
  }
}
