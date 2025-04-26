"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileError() {
  const router = useRouter();

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        <AlertCircle className="mx-auto size-10 animate-pulse" />
        <h1 className="text-secondary text-6xl font-bold">Oops!</h1>
        <h2 className="text-2xl font-medium">Something went wrong</h2>
        <p className="text-gray">
          Error getting user profile. check your internet connection, and try
          again
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="bg-accent inline-block rounded-full px-6 py-2 text-white hover:opacity-90"
          >
            Go Back Home
          </Link>
          <button
            onClick={() => router.refresh()}
            className="border-light-gray text-primary hover:bg-foreground inline-block rounded-full border px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
