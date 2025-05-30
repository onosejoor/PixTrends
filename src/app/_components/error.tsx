"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecentPostsError() {
  const router = useRouter();

  return (
    <div className="border-light-gray bg-foreground sticky top-0 bottom-0 hidden h-screen shrink-0 flex-col gap-5 border-l-2 p-5 py-10 lg:flex lg:w-[400px]">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <AlertCircle className="text-accent h-12 w-12 animate-pulse" />
        <h1 className="text-secondary text-2xl font-bold">Oops!</h1>
        <p className="text-gray">
          Error loading recent posts. Check your internet connection and try again.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.refresh()}
            className="border-light-gray text-primary hover:bg-light-gray rounded-full border px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
