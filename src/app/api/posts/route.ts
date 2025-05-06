import { verifySession } from "@/lib/actions/session";
import { uploadImages } from "@/lib/actions/upload";
import { Post } from "@/lib/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await verifySession();
    const searchParams = req.nextUrl.searchParams;

    const { page, limit } = Object.fromEntries(searchParams.entries()) as {
      page: string;
      limit: string;
    };

    const nextPage = Number(page) || 1;
    const limitValue = Number(limit) || 10;

    const getPosts = await Post.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $skip: (nextPage - 1) * limitValue,
      },
      {
        $limit: limitValue,
      },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          isLiked: {
            $in: [new Types.ObjectId(userId as string), "$likes"],
          },
          isUser: { $eq: ["$user._id", new Types.ObjectId(userId as string)] },
        },
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          images: 1,
          comments: 1,
          isUser: 1,
          likes: 1,
          isLiked: 1,
          views: 1,
          "user._id": 1,
          "user.username": 1,
          "user.avatar": 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, posts: getPosts });
  } catch (error) {
    console.log("[GET_HOME_POSTS_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const text = formData.get("text");
  const images = formData.getAll("images");
  try {
    const { isAuth, userId, username } = await verifySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "unauthorized!" },
        { status: 401 },
      );
    }

    if (!text && images.length < 1) {
      return NextResponse.json(
        { success: false, message: "Either text, or images must be filled!" },
        { status: 400 },
      );
    }

    let imageUrls: string[] = [];

    if (images.length > 0) {
      const { success, urls, message } = await uploadImages(images as File[]);

      if (!success) {
        console.log("[POST_UPLOAD_IMAGES_ERROR]:", message);

        return NextResponse.json(
          { success: false, message: "Error uploading images!" },
          { status: 500 },
        );
      }

      imageUrls = urls!;
    }

    const newPost = new Post({
      user: userId,
      content: text,
      images: imageUrls,
    });

    await newPost.save();

    const link = `/${username}/posts/${newPost.id}`;

    return NextResponse.json({
      success: true,
      message: "Post has been created",
      link,
    });
  } catch (error) {
    console.log("[CREATE_NEW_POST_ERROR]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * for old code
 */

// const getPost = await Post.find({})
//   .populate("user", ["_id", "username", "avatar"])
//   .limit(limitValue)
//   .sort({ createdAt: -1 })
//   .skip((nextPage - 1) * limitValue);
