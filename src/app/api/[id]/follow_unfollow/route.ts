import { veryfySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendNotification } from "@/lib/actions/notification";

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

    const alreadyFollowing = currentUser.following.some((id) =>
      id.equals(userToFollowId as string),
    );

    if (alreadyFollowing) {
      return NextResponse.json(
        { success: false, message: "you are already following this user" },
        { status: 400 },
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await findUsertoFollow.updateOne(
        { $push: { followers: userId } },
        { session },
      );
      await currentUser.updateOne(
        { $push: { following: userToFollowId } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      await sendNotification({ reciever: userToFollowId, type: "follow" });

      return NextResponse.json(
        {
          success: true,
          message: "User followed",
        },
        { status: 201 },
      );
    } catch (error) {
      console.log("[UPDATE_FOLLOWERS_TRANSACTION_ERROR]: ", error);
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Error updating followers" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log("[FOLLOW_FOLLOWERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const userToUnfollowId = (await params).id;

  try {
    const { userId, isAuth } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User not authorised" },
        { status: 401 },
      );
    }

    const findUserToUnfollow = await User.findById(userToUnfollowId);
    const currentUser = await User.findById(userId);

    if (!findUserToUnfollow || !currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (userId === findUserToUnfollow) {
      return NextResponse.json(
        { success: false, message: "You cant unfollow yourself" },
        { status: 400 },
      );
    }

    const alreadyFollowing = currentUser.following.some((id) =>
      id.equals(userToUnfollowId as string),
    );

    if (!alreadyFollowing) {
      return NextResponse.json(
        { success: false, message: "you are not following this user" },
        { status: 400 },
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await findUserToUnfollow.updateOne(
        { $pull: { followers: userId } },
        { session },
      );
      await currentUser.updateOne(
        { $pull: { following: userToUnfollowId } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(
        {
          success: true,
          message: "User unfollowed",
        },
        { status: 200 },
      );
    } catch (error) {
      console.log("[UPDATE_FOLLOWERS_TRANSACTION_ERROR]: ", error);
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Error updating followers" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log("[DELETE_FOLLOWERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
