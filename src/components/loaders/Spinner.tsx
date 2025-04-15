import { cx } from "../utils";

type SpinnerProps = {
  color?: "default" | "primary" | "white";
  size?: "small" | "default";
};

export default function Spinner({
  color = "default",
  size = "default",
}: SpinnerProps) {
  const coloClass = {
    default: "border-t-accent",
    primary: "border-t-gray",
    white: "border-t-white",
  };

  const sizeClass = {
    default: "size-7.5",
    small: "size-5",
  };
  return (
    <div
      className={cx(
        "border-foreground animate-spin rounded-full border-5",
        coloClass[color],
        sizeClass[size],
      )}
    ></div>
  );
}
