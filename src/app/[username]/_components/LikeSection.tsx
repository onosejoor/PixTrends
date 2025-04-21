"use client";

import { cx } from "@/components/utils";
import { showToast } from "@/hooks/useToast";
import { likePost } from "@/lib/actions/post";
import { MessageSquare, Share2 } from "lucide-react";
import { Types } from "mongoose";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";

type Props = {
  likes: Types.ObjectId[];
  userId: string | null;
  postId: string;
  comments: number;
};

export default function LikeSection({
  likes,
  userId,
  postId,
  comments,
}: Props) {
  const isLiked = likes.some((id) => id.toString() === userId);

  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes.length);

  const handleClick = async () => {
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
    setLike(!like);

    await likePost(postId);
  };

  async function copyLink() {
    const link = "jbjbwuwguwguw";
    navigator.clipboard.writeText(link);
    showToast({
      variants: "success",
      message: "link coppied to clipboard",
    });
  }

  return (
    <div className="relative z-5 flex items-center gap-7.5">
      <div
        role="button"
        onClick={handleClick}
        className="flex cursor-pointer items-center gap-1.5"
      >
        <div className="group hover:bg-accent/10 grid place-items-center rounded-full p-2">
          <FiHeart
            className={cx(
              "group-hover:stroke-accent stroke-gray size-5",
              like && "fill-accent stroke-accent",
            )}
          />
        </div>

        <span className="text-secondary -ml-2">{likeCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="group hover:bg-accent/10 grid place-items-center rounded-full p-2">
          <MessageSquare className="stroke-gray group-hover:stroke-accent size-5" />
        </div>
        <span className="text-secondary -ml-2">{comments}</span>
      </div>
      <button
        onClick={copyLink}
        className="group hover:bg-accent/10 grid place-items-center rounded-full p-2"
      >
        <Share2 className="stroke-gray group-hover:stroke-accent size-5" />
      </button>
    </div>
  );
}
