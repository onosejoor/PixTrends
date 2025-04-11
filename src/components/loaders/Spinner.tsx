import { cx } from "../utils";

type SpinnerProps = {
  color?: "default" | "primary" | "white";
};

export default function Spinner({ color = "default" }: SpinnerProps) {
  const coloClass = {
    default: "border-t-accent",
    primary: "border-t-gray",
    white: "border-t-white",
  };
  return (
    <div
      className={cx(
        "border-foreground size-10 animate-spin rounded-full border-5",
        coloClass[color!],
      )}
    ></div>
  );
}
