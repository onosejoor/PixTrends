"use client";

import { FormEvent, useState } from "react";

// import { Types } from "mongoose";
import Img from "@/components/Img";
import relativeTime from "dayjs/plugin/relativeTime";

import { Heart, Send } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import useSWR, { mutate } from "swr";
import CommentLoader from "@/components/loaders/CommentLoader";
import CommentEmptyState from "@/components/empty-states/CommentEmptyState";
import { showToast } from "@/hooks/useToast";

// interface CommentProps {
//   post: Types.ObjectId;
// }

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  comments: IComment[];
};

type ServerResponse = {
  success: boolean;
  message: string;
};

export default function CommentSection({ postId }: { postId: string }) {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    `/api/comments?postId=${postId}`,
    fetcher,
  );
  const [commentText, setCommentText] = useState("");
  const isDisabled = !commentText.trim() || commentText.length > 200;

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <CommentLoader />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const postComment = await axios.post<ServerResponse>("/api/comments", {
      commentText,
      postId,
    });
    const response = postComment.data;

    showToast({
      variants: response.success ? "success" : "error",
      message: response.message,
    });

    if (response.success) {
      setCommentText("");
      await mutate("/api/comments");
    }
  }

  const { comments } = data!;

  return (
    <div className="mx-auto w-full">
      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="mb-6 flex gap-4">
          <Img
            className="size-7.5 rounded-full object-cover"
            src={"/images/chal.png"}
            alt="user"
          />
          <div className="flex-1">
            <textarea
              placeholder="Add a comment..."
              className="border-light-gray mb-2 w-full resize-none rounded-[10px] border p-3 outline-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="bg-primary flex items-center gap-2 rounded-[10px] p-2 px-3 text-sm text-white disabled:opacity-50"
              disabled={isDisabled}
            >
              <span>
                <Send className="size-4 text-white" />
              </span>
              Post
            </button>
          </div>
        </div>
      </form>

      <div className="divide-light-gray divide-y">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCards key={comment._id.toString()} comment={comment} />
          ))
        ) : (
          <CommentEmptyState />
        )}
      </div>
    </div>
  );
}

const CommentCards = ({ comment }: { comment: IComment }) => (
  <div className="flex gap-4 py-5">
    <Img
      className="size-10 rounded-full"
      src={"/images/chal.png"}
      alt={`${comment.user.name}'s avatar`}
    />

    <div className="flex-1 space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-primary font-medium">{comment.user.name}</span>
          <span className="text-accent ml-2 text-xs">
            @{comment.user.username}
          </span>
        </div>
      </div>

      <p className="text-secondary text-sm">{comment.content}</p>

      <div className="text-gray flex items-center gap-4 pt-1 text-xs">
        <span>{dayjs(comment.createdAt).fromNow(true)}</span>
        <div className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {/* <span>{comment.likes}</span> */}
        </div>
        <button className="h-6 px-2 text-xs">Reply</button>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3 pt-2 pl-6">
          {comment.replies.map((reply) => (
            <div
              key={reply._id.toString()}
              className="flex gap-4 border-b pb-6 last:border-0"
            >
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
                  <span>{dayjs(reply.createdAt).fromNow(true)}</span>
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
