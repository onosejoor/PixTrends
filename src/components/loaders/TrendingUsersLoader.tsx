import { Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function TrendingUsersLoader() {
  return (
    <section className="px-6">
      <div className="mb-6 flex items-center gap-2">
        <Users size={20} className="text-accent" />
        <h3 className="text-primary text-lg font-semibold">Trending Users</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="border-light-gray hover:border-accent animate-pulse rounded-lg border bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="size-12" />
              <div className="grid min-w-0 flex-1 gap-2">
                <Skeleton />
                <Skeleton />

                <div className="flex w-full items-center gap-5 *:w-full">
                  <div className="flex items-center gap-2">
                    <span>
                      <Skeleton className="w-12.5" />
                    </span>
                    <Skeleton className="w-12.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      <Skeleton className="w-12.5" />
                    </span>
                    <Skeleton className="w-12.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
