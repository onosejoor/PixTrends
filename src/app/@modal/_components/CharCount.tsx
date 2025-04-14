"use client";

import { cx } from "@/components/utils";
import { useState, useEffect } from "react";

interface CharCountCircleProps {
  text: string;
  disabled: boolean;
}

export default function CharCountCircle({
  text,
  disabled,
}: CharCountCircleProps) {
  const [charCount, setCharCount] = useState(0);
  const maxCount = 200;

  const isDisabled = disabled || charCount > maxCount;

  useEffect(() => {
    const chars = text.length;
    setCharCount(chars);
  }, [text]);

  const percentage = Math.min((charCount / maxCount) * 100, 100);

  const getColor = () => {
    if (charCount >= maxCount) return "text-red-500";
    if (charCount >= maxCount * 0.8) return "text-yellow-500";
    return "text-sky-500";
  };

  const getTextColor = () => {
    if (charCount >= maxCount) return "text-red-500";
    if (charCount >= maxCount * 0.8) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <div className={`flex items-center gap-4`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {charCount > maxCount
            ? `-${charCount - maxCount}`
            : `${maxCount - charCount}`}
        </span>

        {/* Circle indicator */}
        <div className="relative h-6 w-6">
          {/* Background circle */}
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
          </svg>

          {/* Progress circle */}
          <svg
            className={`absolute top-0 left-0 h-6 w-6 -rotate-90 ${getColor()}`}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${percentage * 0.628} 100`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={cx(
          "bg-primary h-fit rounded-full p-2 px-5 text-white",
          isDisabled && "bg-primary/50 cursor-not-allowed",
        )}
      >
        Post
      </button>
    </div>
  );
}
