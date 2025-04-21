import { Skeleton } from "../ui/skeleton";
import CommentLoader from "./CommentLoader";

export default function DynamicPostLoader() {
  return (
    <article className="grid gap-7 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-5">
          <Skeleton className="size-10" />
          <div className="grid h-fit gap-1">
            <Skeleton className="w-25" />
            <Skeleton className="w-25" />
          </div>
        </div>
        <Skeleton />
        <Skeleton className="h-125 rounded-[10px]" />
      </div>

      <CommentLoader />
    </article>
  );
}
