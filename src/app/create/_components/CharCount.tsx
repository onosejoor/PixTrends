"use client";

import { cx } from "@/components/utils";
import { memo } from "react";

interface CharCountCircleProps {
  text: string;
  disabled: boolean;
  loading: boolean;
}

function CharCountCircle({ text, disabled, loading }: CharCountCircleProps) {
  const maxCount = 300;

  const charCount = text.length;
  const isDisabled = disabled || charCount > maxCount;

  // const { percentage, color } = useMemo(() => {
  //   const percentage = Math.min((charCount / maxCount) * 100, 100);
  //   const color =
  //     charCount >= maxCount
  //       ? "text-red-500"
  //       : charCount >= maxCount * 0.8
  //       ? "text-yellow-500"
  //       : "text-sky-500";
  //   return { percentage, color };
  // }, [charCount, maxCount]);

  const isGreater = charCount >= maxCount;

  return (
    <div className={`flex items-center gap-4`}>
      <div className="flex items-center gap-2">
        <span
          className={cx(
            `text-gray text-sm font-medium`,
            isGreater && "text-red-500",
          )}
        >
          {maxCount - charCount}
        </span>

        <button
          type="submit"
          disabled={isDisabled}
          className={cx(
            "bg-primary h-fit rounded-full p-2 px-5 text-white",
            isDisabled && "bg-primary/50 cursor-not-allowed",
          )}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default memo(CharCountCircle);
