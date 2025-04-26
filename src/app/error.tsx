"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="bg-background text-primary flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        <AlertCircle className="size-10 animate-pulse mx-auto" />
        <h1 className="text-secondary text-6xl font-bold">Oops!</h1>
        <h2 className="text-2xl font-medium">Something went wrong</h2>
        <p className="text-gray">
          An unexpected error has occurred. We&lsquo;re working on it—please try
          again shortly.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="bg-accent inline-block rounded-full px-6 py-2 text-white hover:opacity-90"
          >
            Go Back Home
          </Link>
          <button
            onClick={reset}
            className="border-light-gray text-primary hover:bg-foreground inline-block rounded-full border px-6 py-2"
          >
            Try Again
          </button>
        </div>

        {error.digest && <p className="text-lg">Digest: {error.digest}</p>}
      </div>
    </div>
  );
}
