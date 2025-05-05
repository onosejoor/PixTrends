"use server";

import { redirect } from "next/navigation";
import { Post } from "../models";
import { sendNotification } from "./notification";
import { verifySession } from "./session";

export async function likePost(postId: string) {
  const { isAuth, userId } = await verifySession();

  if (!isAuth) {
    redirect("/signin")
    return { success: false, message: "login to continue" };
  }
  try {
    const findPost = await Post.findById(postId);

    if (!findPost) {
      return { success: false, message: "No Post found!" };
    }

    const isLiked = findPost?.likes.some((id) => id.toString() === userId);

    const isUser = findPost.user.equals(userId as string);

    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });

    if (!isLiked && !isUser) {
      sendNotification({
        receiver: findPost.user._id.toString(),
        type: "like",
        postId: findPost.id,
      });
    }

    return isLiked
      ? { success: true, message: "Post like removed!" }
      : { success: true, message: "Post liked!" };
  } catch (error) {
    console.log("[POST_LIKE_ERROR]: ", error);
    return { success: false, message: "Error liking post" };
  }
}

export async function deletePost(postId: string) {
  try {
    await Post.findByIdAndDelete(postId);

    return { success: true, message: "Post deleted!" };
  } catch (error) {
    console.log("[POST_DELETE_ERROR]: ", error);
    return { success: false, message: "Error deleting post" };
  } finally {
    redirect("/");
  }
}
