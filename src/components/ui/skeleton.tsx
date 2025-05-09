import { HTMLAttributes } from "react";
import { cx } from "../utils";

/**
 *
 * @param param0 HtmlAttributes
 * @default `className: bg-light-gray h-5 w-full animate-pulse rounded-full`
 */

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "bg-light-gray h-5 w-full animate-pulse rounded-full",
      className,
    )}
    {...props}
  ></div>
);

export { Skeleton };
