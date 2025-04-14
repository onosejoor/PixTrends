export default function PageLoader() {
  return (
    <section>
      <div
        className={
          "opacity/70 h-37.5 w-full animate-pulse bg-white sm:h-[200px]"
        }
      ></div>
      <header className="-mt-15 grid h-fit gap-10 px-7.5 sm:px-10">
        <div className="flex items-end gap-5">
          <div className="border-accent bg-light-gray h-37.5 w-37.5 animate-pulse rounded-full border-2"></div>
          <button
            disabled
            className="bg-primary h-fit cursor-not-allowed rounded-full p-2 px-5 text-white opacity-50"
          >
            Follow
          </button>
        </div>

        <div className="*:mb-5">
          <div className="flex gap-5">
            <div className="grid gap-2">
              <b className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></b>
              <p className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></b>
              <p className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></b>
              <p className="bg-light-gray h-5 w-20 animate-pulse rounded-full"></p>
            </div>
          </div>

          <div className="grid h-fit gap-5">
            {[...Array(3)].map((_, index) => (
              <p
                key={index}
                className="bg-light-gray h-5 animate-pulse rounded-full"
              ></p>
            ))}
          </div>
        </div>
      </header>
    </section>
  );
}
