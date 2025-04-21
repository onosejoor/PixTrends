import { Skeleton } from "../ui/skeleton";

export default function CommentLoader() {
  return (
    <div className="divide-light-gray divide-y">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex gap-4 py-5">
          <Skeleton className="size-10 rounded-full" />

          <div className="grid h-fit flex-1 gap-5">
            <div className="flex items-start gap-1">
              <Skeleton className="w-25" />
              <Skeleton className="ml-5 w-25" />
            </div>
            <div className="space-y-1">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
