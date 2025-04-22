import { veryfySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const userToFollowId = (await params).id;

  try {
    const { userId, isAuth } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User not authorised" },
        { status: 401 },
      );
    }

    const findUsertoFollow = await User.findById(userToFollowId);
    const currentUser = await User.findById(userId);

    if (!findUsertoFollow || !currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const isFollowing = currentUser.following.some(id => id.equals(userToFollowId as string))

    if (!isFollowing) {
      return NextResponse.json(
        { success: false, message: "you are not following this user" },
        { status: 400 },
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await findUsertoFollow.updateOne(
        { $pull: { followers: userId } },
        { session },
      );
      await currentUser.updateOne(
        { $pull: { following: userToFollowId } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return NextResponse.json(
        { success: true, message: "User unfollowed" },
        { status: 201 },
      );
    } catch (error) {
      console.log("[UNFOLLOW_FOLLOWERS_TRANSACTION_ERROR]: ", error);
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Error unfollowing followers" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log("[POST_UNFOLLOW_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
