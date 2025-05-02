"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <form className="group relative w-full px-6 xsm:max-w-1/2">
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
        {searchQuery && (
          <button
            onClick={handleClear}
            className="hover:bg-light-gray rounded-full p-1 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray" />
          </button>
        )}
      </div>
    </form>
  );
}
