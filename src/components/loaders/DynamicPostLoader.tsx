import CommentLoader from "./CommentLoader";

export default function DynamicPostLoader() {
  return (
    <article className="grid gap-7 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-5">
          <div className="bg-light-gray size-10 rounded-full"></div>
          <div className="grid h-fit gap-1">
            <h2 className="bg-light-gray h-5 w-25 rounded-full"></h2>
            <p className="bg-light-gray h-5 w-25 rounded-full"></p>
          </div>
        </div>
        <p className="bg-light-gray h-5 rounded-full"></p>
        <div className="bg-light-gray h-125 w-full animate-pulse rounded-[10px]"></div>
      </div>

      <CommentLoader />
    </article>
  );
}
