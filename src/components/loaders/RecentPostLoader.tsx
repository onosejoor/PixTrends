import { Skeleton } from "../ui/skeleton";

export default function RecentPostsLoader() {
  return (
    <div className="lg:flex flex-col sticky top-0 h-screen hidden justify-between p-10 gap-5">
      {[...Array(3)].map((_, index) => {
        return (
          <article key={index}>
            <div className="xsm:shadow-post-card shadow-light-gray/50 xs:rounded-[10px] grid h-fit sm:w-75 gap-3 bg-white p-5 shadow-none">
              <div className="flex items-start gap-5">
                <Skeleton className="size-7.5" />
                <div className="grid h-fit gap-1">
                  <Skeleton className="w-25" />
                  <Skeleton className="w-25" />
                </div>
              </div>

              <div className="grid gap-2">
                <Skeleton />
                <Skeleton />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
