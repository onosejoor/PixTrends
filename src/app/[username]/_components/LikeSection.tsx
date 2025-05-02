"use client";

import { copyToClipboard, cx } from "@/components/utils";
import { likePost } from "@/lib/actions/post";
import { ChartNoAxesColumn, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";

type Props = {
  likes: number;
  isLiked?: boolean;
  postId: string;
  comments: number;
  link: string;
  views: number;
};

export default function LikeSection({
  likes,
  postId,
  comments,
  link,
  views,
  isLiked,
}: Props) {
  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleClick = async () => {
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
    setLike(!like);

    await likePost(postId);
  };

  return (
    <div className="relative z-5 flex w-full items-center justify-between xsm:justify-normal xs:gap-12.5 xs:w-fit">
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
      <div className="flex items-center gap-1.5">
        <div className="group hover:bg-accent/10 grid place-items-center rounded-full p-2">
          <ChartNoAxesColumn className="stroke-gray group-hover:stroke-accent size-5" />
        </div>
        <span className="text-secondary -ml-2">{views}</span>
      </div>
      <button
        onClick={() => copyToClipboard(link)}
        className="group hover:bg-accent/10 grid place-items-center rounded-full p-2"
      >
        <Share2 className="stroke-gray group-hover:stroke-accent size-5" />
      </button>
    </div>
  );
}
