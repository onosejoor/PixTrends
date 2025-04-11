export default function PostLoader() {
  return [...Array(10)].map((_, index) => <LoaderCard key={index} />);
}

const LoaderCard = () => (
  <article className="sm:p-10">
    <div className="xsm:shadow-post-card shadow-light-gray/50 xs:rounded-[10px] grid h-fit w-full gap-6 bg-white p-5 shadow-none md:max-w-[700px]">
      <div className="flex items-start gap-5">
        <div className="bg-light-gray size-12.5 animate-pulse rounded-full"></div>
        <div className="grid h-fit gap-1">
          <h2 className="text-primary bg-light-gray h-3 w-25 animate-pulse rounded-full text-lg font-semibold"></h2>
          <time className="text-accent bg-light-gray h-3 w-25 animate-pulse rounded-full font-medium"></time>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {[...Array(3)].map((_, index) => (
          <p key={index} className="bg-light-gray rounded-full h-5 w-full animate-pulse"></p>
        ))}
      </div>

      <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll">
        <picture className="h-full w-[200px] shrink-0 animate-pulse bg-light-gray rounded-[10px]"></picture>
        <picture className="h-full w-[200px] shrink-0 animate-pulse bg-light-gray rounded-[10px]"></picture>
      </div>
    </div>
  </article>
);
