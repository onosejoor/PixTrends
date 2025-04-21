import { Skeleton } from "../ui/skeleton";

export default function PostLoader() {
  return (
    <div className="grid gap-10">
      {[...Array(10)].map((_, index) => (
        <LoaderCard key={index} />
      ))}
    </div>
  );
}

const LoaderCard = () => (
  <article className="sm:p-10">
    <div className="xsm:shadow-post-card shadow-light-gray/50 xs:rounded-[10px] grid h-fit w-full gap-6 bg-white p-5 shadow-none md:max-w-[700px]">
      <div className="flex items-start gap-5">
        <Skeleton className="size-12.5" />
        <div className="grid h-fit gap-1">
          <Skeleton className="h-3 w-25" />
          <Skeleton className="h-3 w-25" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>

      <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll">
        <Skeleton className="bg-light-gray h-full w-[200px] shrink-0 rounded-[10px]" />
        <Skeleton className="bg-light-gray h-full w-[200px] shrink-0 rounded-[10px]" />
      </div>
    </div>
  </article>
);
