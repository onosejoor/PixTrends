"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
// import { Types } from "mongoose";
import Img from "@/components/Img";

// interface CommentProps {
//   post: Types.ObjectId;
// }

export default function CommentSection() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [commentText, setCommentText] = useState("");

  const comments = [
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      time: "2 hours ago",
      text: "This is exactly what I've been looking for! The design is clean and the functionality is intuitive. Great work on this project!",
    },
    {
      id: 2,
      author: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      time: "Yesterday",
      text: "I've been using this for a week now and it's significantly improved my workflow. The attention to detail is impressive.",
    },
    {
      id: 3,
      author: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AR",
      time: "3 days ago",
      text: "Quick question - is there a way to customize the notification settings? Otherwise, this is fantastic!",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Comments {!showEmpty && `(${comments.length})`}
        </h2>
        <button
          onClick={() => setShowEmpty(!showEmpty)}
          className="text-sm"
        >
          {showEmpty ? "Show Comments" : "Show Empty State"}
        </button>
      </div>

      <div className="mb-8">
        <div className="mb-6 flex gap-4">
          <Img
            className="size-7.5 object-cover"
            src={"/images/chal.png"}
            alt="user"
          />
          <div className="flex-1">
            <textarea
              placeholder="Add a comment..."
              className="mb-2 resize-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button disabled={!commentText.trim()}>Post Comment</button>
          </div>
        </div>
      </div>

      {showEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <MessageSquare className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No comments yet</h3>
          <p className="text-muted-foreground max-w-md">
            Be the first to share your thoughts on this post. Your insights and
            questions are welcome!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 border-b pb-6 last:border-0"
            >
              <Img
                className="h-10 w-10"
                src={comment.avatar || "/images/chal.png"}
                alt={`${comment.author}'s avatar`}
              />

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-muted-foreground text-xs">
                    {comment.time}
                  </span>
                </div>
                <p className="text-sm">{comment.text}</p>
                  <button className="text-muted-foreground hover:text-foreground text-xs">
                    Like
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
