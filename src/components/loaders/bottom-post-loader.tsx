import { Loader2 } from "lucide-react";
import { RefObject } from "react";

export default function BottomPostLoader({
  ref,
  isValidating,
}: {
  ref: RefObject<HTMLDivElement | null>;
  isValidating: boolean;
}) {
  return (
    <div ref={ref} className="flex items-center justify-center py-4">
      {isValidating && <Loader2 className="text-gray h-6 w-6 animate-spin" />}
    </div>
  );
}
