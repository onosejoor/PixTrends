"use server";

import { Post } from "../models";
import { sendNotification } from "./notification";
import { veryfySession } from "./session";

export async function likePost(postId: string) {
  try {
    const { isAuth, userId, username } = await veryfySession();

    if (!isAuth) {
      return { success: false, message: "Unauthorized!" };
    }

    const findPost = await Post.findById(postId).populate("user");

    if (!findPost) {
      return { success: false, message: "No Post found!" };
    }

    const isLiked = findPost?.likes.some((id) => id.toString() === userId);

    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });

    if (!isLiked) {
      sendNotification({
        reciever: findPost.user._id.toString(),
        message: `${username} liked your post!`,
        type: "like",
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
