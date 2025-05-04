import { sendNotification } from "@/lib/actions/notification";
import { verifySession } from "@/lib/actions/session";
import { Comment, Post, User } from "@/lib/models";
import { startSession } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const postId = searchParams.get("postId");

  const selectedFields = ["name", "avatar", "username", "_id"];

  if (!postId) {
    return NextResponse.json(
      { success: false, message: "No PostId!" },
      { status: 400 },
    );
  }

  try {
    const { userId } = await verifySession();
    const findPost = await Post.exists({ _id: postId });

    if (!findPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const [currentUser, getComments] = await Promise.all([
      User.findById(userId).select(["name", "_id", "username", "avatar"]),
      Comment.find({ post: postId, parentId: null })
        .populate([
          {
            path: "replies",
            populate: {
              path: "user",
              select: selectedFields,
            },
            options: { sort: { createdAt: 1 } },
          },
          { path: "user", select: selectedFields },
        ])
        .sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({ success: true, comments: getComments, currentUser });
  } catch (error) {
    console.log("[GET_COMMENTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, postId, parentId } = (await req.json()) as {
      text: string;
      postId: string;
      parentId: string | null;
    };

    const { isAuth, userId } = await verifySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "UnAuthenticated" },
        { status: 401 },
      );
    }

    if (!text) {
      return NextResponse.json(
        { success: false, message: "No comment text provided" },
        { status: 400 },
      );
    }

    const getPost = await Post.findById(postId);

    if (!getPost) {
      return NextResponse.json(
        { success: false, message: "Post Not found" },
        { status: 404 },
      );
    }

    const session = await startSession();

    try {
      session.startTransaction();
      const newComment = await Comment.create(
        [
          {
            user: userId,
            content: text,
            post: postId,
            ...(parentId && { parentId }),
          },
        ],
        { session },
      );

      if (!parentId) {
        await getPost.updateOne({ $inc: { comments: 1 } }, { session });
      }

      await session.commitTransaction();
      session.endSession();

      if (!getPost.user._id.equals(userId as string)) {
        await sendNotification({
          receiver: getPost.user._id.toString(),
          type: "comment",
          postId,
          commentId: newComment[0].id,
        });
      }

      return NextResponse.json(
        { success: true, message: "Comment created " },
        { status: 201 },
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log("[POST_COMMENT_TRANSACTION_ERROR]:", error);

      return NextResponse.json(
        { success: false, message: "Error creating comment" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log("[POST_COMMENT_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Error creating comment" },
      { status: 500 },
    );
  }
}
