import { Skeleton } from "../ui/skeleton";

export default function NotificationLoader() {
  return (
    <div className="divide-accent divide-y">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex w-full gap-5 p-5">
          <Skeleton className="size-7.5" />
          <div className="grid gap-5 w-full">
            <Skeleton className="shadow-avatar size-10" />

            <div className="w-full grid gap-2">
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
