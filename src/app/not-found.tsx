import Link from "next/link";

export default function Custom404() {
  return (
    <div className="bg-background text-primary flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-secondary text-7xl font-bold">404</h1>
        <h2 className="text-2xl font-medium">Page not found</h2>
        <p className="text-gray">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-accent mt-4 inline-block rounded-full px-6 py-2 text-white hover:opacity-90"
        >
          Go Back Home
        </Link>
      </div>

      <div className="mt-12 animate-bounce">
        <svg
          className="text-light-gray h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </div>
  );
}
