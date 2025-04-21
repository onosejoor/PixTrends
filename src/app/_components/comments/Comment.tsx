"use client";

import { useState } from "react";

import Img from "@/components/Img";
import relativeTime from "dayjs/plugin/relativeTime";

import { Heart } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import useSWR from "swr";
import CommentLoader from "@/components/loaders/CommentLoader";
import CommentEmptyState from "@/components/empty-states/CommentEmptyState";

import CommentForm from "./CommentForm";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  comments: IComment[];
};

type CardProps = {
  user: IUser;
  postId: string;
  comment: IComment;
  replyingTo: string;
  setReplyingAction: (id: string) => void;
};

export default function CommentSection({
  postId,
  user,
}: {
  postId: string;

  user: IUser;
}) {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    `/api/comments?postId=${postId}`,
    fetcher,
  );
  const [replyingTo, setReplyingTo] = useState("");

  const handleReplyingTo = (id: string) => {
    setReplyingTo(id);
  };

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <CommentLoader />;
  }

  const { comments } = data!;

  return (
    <div className="mx-auto w-full">
      <CommentForm postId={postId} user={user} />

      <div className="divide-light-gray divide-y">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCards
              user={user}
              postId={postId}
              key={comment._id.toString()}
              replyingTo={replyingTo}
              setReplyingAction={handleReplyingTo}
              comment={comment}
            />
          ))
        ) : (
          <CommentEmptyState />
        )}
      </div>
    </div>
  );
}

const CommentCards = ({
  comment,
  setReplyingAction,
  user,
  replyingTo,
  postId,
}: CardProps) => {
  const isReplying = replyingTo === comment._id.toString();
  return (
    <div className="flex flex-col gap-4 py-5">
      <div className="flex items-center gap-4">
        <Img
          className="size-10 rounded-full"
          src={"/images/chal.png"}
          alt={`${comment.user.name}'s avatar`}
        />
        <div className="flex items-start justify-between">
          <div>
            <span className="text-primary font-medium">
              {comment.user.name}
            </span>
            <span className="text-accent ml-2 text-sm">
              @{comment.user.username}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <p className="text-secondary text-sm xsm:text-base">{comment.content}</p>

        <div className="text-gray flex items-center gap-4 pt-1 text-sm">
          <span>{dayjs(comment.createdAt).fromNow()}</span>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
          </div>

          <button
            onClick={() =>
              setReplyingAction(isReplying ? "" : comment._id.toString())
            }
            className="hover:bg-light-gray/50 h-6 rounded-sm px-2 text-sm"
          >
            {isReplying ? "Hide" : "Reply"}
          </button>
        </div>
        {isReplying && (
          <CommentForm
            parentId={comment._id.toString()}
            postId={postId}
            reply
            user={user}
          />
        )}

        {comment.replies.length > 0 && (
          <div className="divide-light-gray border-light-gray pl-0 xsm:mt-3 space-y-3 divide-y border-l pt-2 xsm:pl-3 md:pl-6">
            {comment.replies.map((reply) => (
              <div key={reply._id.toString()} className="flex gap-4 py-5 px-5">
                <Img
                  className="size-10 rounded-full"
                  src={"/images/chal.png"}
                  alt={`${reply.user.name}'s avatar`}
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-primary font-medium">
                        {reply.user.name}
                      </span>
                      <span className="text-accent ml-2 text-xs">
                        @{reply.user.username}
                      </span>
                    </div>
                  </div>

                  <p className="text-secondary text-sm">{reply.content}</p>

                  <div className="text-gray flex items-center gap-4 pt-1 text-xs">
                    <span>{dayjs(reply.createdAt).fromNow()}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {/* <span>{reply.likes}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
