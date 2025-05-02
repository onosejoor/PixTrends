import { verifySession } from "@/lib/actions/session";
import { Notification } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await verifySession();

    const deleteId = (await params).id;

    const notificationToDelete = await Notification.findById(deleteId);

    if (!notificationToDelete) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 400 },
      );
    }

    if (!notificationToDelete.sender.equals(userId as string)) {
      return NextResponse.json(
        { success: false, message: "Not your Notification!" },
        { status: 400 },
      );
    }

    await notificationToDelete.deleteOne();

    return NextResponse.json(
      { success: true, message: "notification deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.log("[DELETE_NOTIFICATION_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
