import Link from "next/link";
import { PiPlusCircleFill } from "react-icons/pi";
import { EmptyStateIcon } from "../Icons";

interface EmptyStateProps {
  isUser?: boolean;
}

export default function EmptyState({ isUser }: EmptyStateProps) {
  return (
    <div className="bg-gray/10 flex h-[500px] flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8">
          <EmptyStateIcon />
        </div>

        <h2 className="mb-4 text-2xl font-bold">No Posts Yet</h2>

        <p className="text-gray mb-10">
          {isUser
            ? " Looks like you haven't made any posts yet. Don't worry, just click the  'Create' button and let the universe know you're out there. "
            : "This user hasn't created a post yet."}
        </p>

        {isUser && (
          <Link
            className={
              "bg-accent hover:bg-accent/90 flex items-center gap-2 rounded-full px-8 py-3 font-medium text-white transition-colors"
            }
            href={"/create"}
          >
            {" "}
            <PiPlusCircleFill className="h-5 w-5" />
            Create
          </Link>
        )}
      </div>
    </div>
  );
}

export function TrendingPostsEmptyState() {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8">
          <EmptyStateIcon />
        </div>

        <h2 className="mb-4 text-2xl font-bold">
          No Post for the current query
        </h2>

        <p className="text-gray mb-10">Try another query</p>
      </div>
    </div>
  );
}
