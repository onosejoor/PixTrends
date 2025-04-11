export default function ButtonLoader() {
  return (
    <div className="mx-auto flex h-[25px] w-[100px] items-center justify-center gap-1.5">
      <span
        className={`animate-scale h-full w-1 rounded-full bg-white [animation-delay:0.7s]`}
      ></span>
      <span
        className={`animate-scale h-full w-1 rounded-full bg-white [animation-delay:0.6s]`}
      ></span>
      <span
        className={`animate-scale h-full w-1 rounded-full bg-white [animation-delay:0.5s]`}
      ></span>
      <span
        className={`animate-scale h-full w-1 rounded-full bg-white [animation-delay:0.4s]`}
      ></span>
    </div>
  );
}
