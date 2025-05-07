"use client";

import { useState, useMemo } from "react";

import Img from "@/components/Img";
import relativeTime from "dayjs/plugin/relativeTime";

import { Heart } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import useSWR from "swr";
import CommentLoader from "@/components/loaders/CommentLoader";
import CommentEmptyState from "@/components/empty-states/CommentEmptyState";

import CommentForm from "./CommentForm";
import CommentError from "./CommentsError";
import Link from "next/link";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  comments: IComment[];
  currentUser: IUserPreview;
};

type CardProps = {
  postId: string;
  comment: IComment;
  currentUser: IUserPreview;
  replyingTo: string;
  setReplyingAction: (id: string) => void;
};

export default function CommentSection({ postId }: { postId: string }) {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    `/api/comments?postId=${postId}`,
    fetcher,
  );
  const [replyingTo, setReplyingTo] = useState("");

  const handleReplyingTo = (id: string) => {
    setReplyingTo(id);
  };

  const renderedComments = useMemo(() => {
    if (!data) return null;
    const { comments, currentUser } = data;
    return comments.map((comment) => (
      <CommentCards
        currentUser={currentUser}
        postId={postId}
        key={comment._id.toString()}
        replyingTo={replyingTo}
        setReplyingAction={handleReplyingTo}
        comment={comment}
      />
    ));
  }, [data, postId, replyingTo]);

  if (error) {
    return <CommentError />;
  }

  if (isLoading) {
    return <CommentLoader />;
  }

  const { currentUser, comments } = data!;

  return (
    <div className="mx-auto w-full">
      {currentUser && <CommentForm postId={postId} currentUser={currentUser} />}

      <div className="divide-light-gray divide-y">
        {comments.length > 0 ? renderedComments : <CommentEmptyState />}
      </div>
    </div>
  );
}

const CommentCards = ({
  comment,
  setReplyingAction,
  replyingTo,
  postId,
  currentUser,
}: CardProps) => {
  const isReplying = replyingTo === comment._id.toString();

  return (
    <div className="flex flex-col gap-4 py-5">
      <Link
        href={`/${comment.user.username}`}
        className="flex items-center gap-4"
      >
        <Img
          className="size-10 rounded-full object-cover"
          src={comment.user.avatar}
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
      </Link>

      <div className="flex-1 space-y-2">
        <p className="text-secondary xsm:text-base text-sm">
          {comment.content}
        </p>

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

        {isReplying && currentUser && (
          <CommentForm
            parentId={comment._id.toString()}
            postId={postId}
            reply
            currentUser={currentUser}
          />
        )}

        {comment.replies.length > 0 && <ReplyCards replies={comment.replies} />}
      </div>
    </div>
  );
};

const ReplyCards = ({ replies }: { replies: IComment[] }) => (
  <div className="divide-light-gray border-light-gray xsm:mt-3 xsm:pl-3 space-y-3 divide-y border-l pt-2 pl-0 md:pl-6">
    {replies.map((reply) => (
      <div key={reply._id.toString()} className="flex gap-4 px-5 py-5">
        <Img
          className="size-10 rounded-full object-cover"
          src={reply.user.avatar}
          alt={`${reply.user.name}'s avatar`}
        />
        <div className="flex-1 space-y-1">
          <Link
            href={`/${reply.user.username}`}
            className="flex items-start justify-between"
          >
            <div>
              <span className="text-primary font-medium">
                {reply.user.name}
              </span>
              <span className="text-accent ml-2 text-xs">
                @{reply.user.username}
              </span>
            </div>
          </Link>
          <p className="text-secondary text-sm">{reply.content}</p>
          <div className="text-gray flex items-center gap-4 pt-1 text-xs">
            <span>{dayjs(reply.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
