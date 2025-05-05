import { Post } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await Post.aggregate([
      { $sample: { size: 3 } },
      { $match: { content: { $ne: "" } } },
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          content: 1,
          createdAt: 1,
          images: 1,
          "user._id": 1,
          "user.username": 1,
          "user.avatar": 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.log("[GET_RECENT_POSTS_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
