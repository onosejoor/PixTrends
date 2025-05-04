"use client";

import Img from "@/components/Img";
import Spinner from "@/components/loaders/Spinner";
import { showToast } from "@/hooks/useToast";
import { search } from "@/lib/actions/search";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchResults({ query }: { query: string }) {
  const [pending, startTransition] = useTransition();
  const [results, setResults] = useState<IUserPreview[] | null>(null);

  const searchAction = useDebouncedCallback(() => {
    startTransition(async () => {
      const searchResults = await fetchSearchResults(query);
      setResults(searchResults);
    });
  }, 500);

  useEffect(() => {
    searchAction();
  }, [query, searchAction]);

  function getTexts() {
    if (!results) {
      return null;
    }
    if (!pending && results.length === 0) {
      return `No results found for ${query}`;
    }
  }

  const clearResults = () => setResults(null);

  return (
    <div className="border-light-gray xsm:max-w-80 shadow-accent/30 grid w-full gap-5 rounded-md border bg-white p-5 shadow-lg">
      <h2 className="text-lg font-semibold">
        Search Results For &apos;{query}&apos;
      </h2>

      {results && results.length > 0 ? (
        <div className="divide-accent space-y-5 divide-y">
          {results.map((user) => (
            <UserCard
              key={user._id.toString()}
              user={user}
              clearAction={clearResults}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray overflow-hidden overflow-ellipsis">
          {getTexts()}
        </div>
      )}

      {pending && <Spinner color="primary" />}
    </div>
  );
}
const UserCard = ({
  user,
  clearAction,
}: {
  clearAction: () => void;
  user: Pick<IUserPreview, "username" | "name" | "avatar">;
}) => {
  const { username, avatar, name } = user;
  return (
    <Link
      href={`/${username}`}
      onClick={clearAction}
      prefetch={false}
      className="border-light-gray hover:border-accent block rounded-lg border bg-white p-2"
    >
      <div className="flex items-start gap-3">
        <Img
          src={avatar}
          alt={`Profile picture of ${name}`}
          className="border-accent size-10 rounded-full border-2 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-primary truncate font-semibold">{name}</h4>
          <p className="text-gray mb-1 text-sm">@{username}</p>
        </div>
      </div>
    </Link>
  );
};

const fetchSearchResults = async (query: string) => {
  try {
    const { success, message, people } = await search(query);

    if (success && people) {
      return JSON.parse(people) as IUserPreview[];
    } else {
      showToast({
        variants: "error",
        message: message || "No results found.",
      });
      return null;
    }
  } catch (error) {
    console.log("error fetching search results", error);
    showToast({
      variants: "error",
      message: error instanceof Error ? error.message : "No results found",
    });
    return null;
  }
};
