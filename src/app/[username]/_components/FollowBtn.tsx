"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useTransition } from "react";
import { KeyedMutator } from "swr";

type Status =
  | "unauthenticated"
  | "self"
  | "following"
  | "notFollowing"
  | "error";

type Props = {
  status: Status;
  userId: string;
  mutate: KeyedMutator<any>;
};

const generalClassname =
  "bg-primary h-fit rounded-full p-2 px-5 text-white transition-all duration-200 disabled:opacity-50";

export default function FollowBtn({
  status: initialStatus,
  userId,
  mutate,
}: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleFollowFunction = (action: "follow" | "unfollow") => {
    const optimisticStatus = action === "follow" ? "following" : "notFollowing";
    setStatus(optimisticStatus);

    startTransition(async () => {
      const method = action === "follow" ? "put" : "delete";
      try {
        await axios[method](`/api/${userId}/follow_unfollow`);
      } catch (error) {
        console.error("Follow/unfollow failed:", error);
        setStatus(initialStatus);
      } finally {
        mutate();
      }
    });
  };

  if (status === "self") {
    return (
      <Link href="/settings" className={generalClassname}>
        Edit Profile
      </Link>
    );
  }

  if (status === "following") {
    return (
      <button
        className={generalClassname}
        onClick={() => handleFollowFunction("unfollow")}
        disabled={isPending}
      >
        {isPending ? "Follow" : "Unfollow"}
      </button>
    );
  }

  if (status === "notFollowing") {
    return (
      <button
        className={generalClassname}
        onClick={() => handleFollowFunction("follow")}
        disabled={isPending}
      >
        {isPending ? "Unfollow" : "Follow"}
      </button>
    );
  }

  return (
    <button className={generalClassname} disabled={isPending}>
      {isPending ? "Unfollow" : "Follow"}
    </button>
  );
}
