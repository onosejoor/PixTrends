"use client";

import axios from "axios";
import Link from "next/link";

type Status =
  | "unauthenticated"
  | "self"
  | "following"
  | "notFollowing"
  | "error";

type Props = {
  status: Status;
  userId: string;
};

type APIResponse = {
  success: boolean;
  message: string;
};

const generalClassname = "bg-primary h-fit rounded-full p-2 px-5 text-white";

export default function FollowBtn({ status, userId }: Props) {
  async function handleFollow() {
     await axios.put<APIResponse>(`/api/${userId}/follow`);
  }

  async function handleUnfollow() {
    await axios.put<APIResponse>(`/api/${userId}/unfollow`);
 }

  if (status === "self") {
    return (
      <Link href={"/settings"} className={generalClassname}>
        Edit Profile
      </Link>
    );
  }

  if (status === "following") {
    return <button className={generalClassname} onClick={handleUnfollow}>Unfollow</button>;
  }
  return <button className={generalClassname} onClick={handleFollow}>Follow</button>;
}
