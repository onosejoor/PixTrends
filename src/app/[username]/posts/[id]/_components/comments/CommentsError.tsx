"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CommentError() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Oops</h3>
      <p className="text-gray max-w-md">
        An error occurred while loading comments. Please check your internet
        connevtion, try again later.
      </p>
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="bg-accent rounded-full px-6 py-2 text-white hover:opacity-90"
        >
          Go Back Home
        </Link>
        <button
          onClick={() => router.refresh()}
          className="border-light-gray text-primary hover:bg-light-gray rounded-full border px-6 py-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
