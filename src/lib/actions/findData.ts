"use server";

import connectDB from "../db";
import { Post, User } from "../models";

if (!global.mongoose) {
  await connectDB();
}

export async function findUser(username: string) {
  const findUser = await User.findOne({ username });

  return findUser;
}

export async function findPostPopulate(id: string) {
  const findOnePost = await Post.findById(id)
    .select(["_id", "content", "user", "images"])
    .populate<{
      user: IUserPreview;
    }>("user", "name username avatar")

    .lean();

  return findOnePost;
}

export async function findPostOne(id: string) {
  const findOnePost = await Post.findById(id).select(["views user"]);

  return findOnePost;
}
