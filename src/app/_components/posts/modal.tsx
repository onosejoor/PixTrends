"use client";

import { useState } from "react";
import { CopyIcon, EllipsisVertical, TrashIcon } from "lucide-react";
import { deletePost } from "@/lib/actions/post";
import { showToast } from "@/hooks/useToast";

type Props = {
  postId: string;
  username: string;
  isUser?: boolean;
};

export default function PostCardModal({ isUser, postId, username }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    await deletePost(postId);
    setShowModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}`);
    showToast({
      variants: "success",
      message: "Profile link copied to clipboard!",
    });
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-1 flex items-center justify-center bg-transparent"
          onClick={() => setShowModal(false)}
        />
      )}
      <div className="relative">
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <EllipsisVertical className="text-primary h-5 w-5" />
        </button>

        {showModal && (
          <div className="animate-in zoom-in-0 absolute right-full z-10 min-w-50 rounded-xl bg-white p-5 shadow-xl">
            <ul className="space-y-3">
              <li className="w-full">
                <button
                  onClick={handleCopy}
                  className="text-gray hover:text-primary hover:bg-foreground flex w-full items-center gap-3 rounded-md p-3 text-left text-base"
                >
                  <CopyIcon className="text-gray size-5" />
                  <span className="whitespace-nowrap">Copy Profile Link</span>
                </button>
              </li>
              {isUser && (
                <li className="w-full">
                  <button
                    onClick={handleDelete}
                    className="hover:text-primary hover:bg-foreground flex w-full items-center gap-3 rounded-md p-3 text-left text-base text-red-500"
                  >
                    <TrashIcon className="size-5 text-red-500" />
                    Delete
                  </button>
                </li>
              )}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full px-3 text-left text-base text-blue-500 hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
