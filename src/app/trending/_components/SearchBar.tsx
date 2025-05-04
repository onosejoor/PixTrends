"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import SearchResults from "./SearchResults";
import { useRouter } from "next/navigation";
import { cx } from "@/components/utils";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    const isTrendingPage = window.location.pathname === "/trending";
    if (searchQuery) {
      if (isTrendingPage) {
        router.replace(`/trending?query=${searchQuery}`);
        return
      }
      router.push(`/trending?query=${searchQuery}`);
    }
  };

  return (
    <div className="grid w-fit gap-5 px-6">
      <form
        action={handleSubmit}
        className="group xsm:max-w-80 relative w-full"
      >
        <div
          className={
            "border-light-gray bg-light-gray/50 group-has-focus:border-gray flex items-center gap-5 rounded-full border px-4 py-1 peer-focus:shadow-sm"
          }
        >
          <Search size={18} className={"text-gray peer-focus:!text-accent"} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="placeholder:text-gray peer text-primary flex-1 gap-3 border-none bg-transparent py-2 text-sm outline-none"
          />
          <div
            onClick={handleClear}
            className={cx(
              "hover:bg-light-gray rounded-full p-1 transition-colors",
              !searchQuery && "invisible",
            )}
            aria-label="Clear search"
          >
            <X size={16} className="text-gray" />
          </div>
        </div>

        <div className="absolute inset-0 top-full mt-5">
          {searchQuery.trim() && <SearchResults query={searchQuery} />}
        </div>
      </form>
    </div>
  );
}
