export default function CommentLoader() {
  return (
    <div className="divide-light-gray divide-y">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex gap-4 py-5">
          <div className="bg-light-gray size-10 animate-pulse rounded-full"></div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-light-gray h-5 w-25 animate-pulse rounded-full"></span>
                <span className="bg-light-gray ml-2 h-5 w-25 animate-pulse rounded-full"></span>
              </div>
            </div>
            <p className="bg-light-gray bg-sm h-5 animate-pulse rounded-full"></p>
            <p className="bg-light-gray bg-sm h-5 animate-pulse rounded-full"></p>

            <div className="bg-light-gray flex h-5 animate-pulse items-center gap-4 rounded-full pt-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
