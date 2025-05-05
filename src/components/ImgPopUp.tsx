"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cx } from "./utils";
import Img from "./Img";

interface ImagePopupProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImagePopup({ src, alt, className }: ImagePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Img
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        className={cx("cursor-pointer", className)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-7xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close image"
            >
              <X className="h-6 w-6" />
            </button>

            <Img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
