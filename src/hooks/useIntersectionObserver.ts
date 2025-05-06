"use client";

import { RefObject, useEffect } from "react";

type Props = {
  ref: RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  onIntersect: () => void
};

export default function useIntersectionObserver({ ref, isValidating , onIntersect}: Props) {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isValidating) {
          onIntersect()
        } 
      },
      { threshold: 1.0 },
    );

    observer.observe(ref.current);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isValidating, ref, onIntersect]);

}
