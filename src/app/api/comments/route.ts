import { veryfySession } from "@/lib/actions/session";
import { Comment, Post } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { success: false, message: "No PostId!" },
      { status: 400 },
    );
  }

  try {
    const findPost = await Post.findById(postId);

    if (!findPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const getComments = await Comment.find({ post: postId, parentId: null })
      .populate([
        {
          path: "replies",
          options: { sort: { createdAt: 1 } },
        },
        { path: "user", select: ["-password", "-email"] },
      ])
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments: getComments });
  } catch (error) {
    console.log("[GET_COMMENTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
};

export async function POST(req: NextRequest) {
  try {
    const { commentText, postId, parentId } = (await req.json()) as {
      commentText: string;
      postId: string;
      parentId: string | null;
    };
    
    const { isAuth, userId } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "UnAuthenticated" },
        { status: 401 },
      );
    }

    if (!commentText) {
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

    await Comment.create({
      user: userId,
      content: commentText,
      post: postId,
      ...(parentId && { parentId }),
    });

    return NextResponse.json(
      { success: true, message: "Comment created " },
      { status: 200 },
    );
  } catch (error) {
    console.log("[POST_COMMENT_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Error creating comment" },
      { status: 500 },
    );
  }
}
