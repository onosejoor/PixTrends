import { veryfySession } from "@/lib/actions/session";
import { Post } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAuth, userId } = await veryfySession();

    const id = (await params).id;

    const findPost = await Post.findById(id).populate<{ user: IUser }>("user", [
      "-email",
      "-password",
    ]);

    if (!findPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      post: findPost,
      userId: isAuth ? userId : null,
    });
  } catch (error) {
    console.log("[GET_POST_BY_ID_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
