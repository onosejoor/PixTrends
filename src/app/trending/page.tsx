import { Suspense } from "react";
import { SearchBar } from "./_components/SearchBar";
import TrendingPosts from "./_components/TrendingPosts";
import { TrendingUsers } from "./_components/TrendingUsers";
import TrendingUsersLoader from "@/components/loaders/TrendingUsersLoader";
import PostLoader from "@/components/loaders/PostLoader";

export default function TrendingPage() {
  return (
    <div className="grid gap-5 py-10">
      <SearchBar />
      <hr className="border-light-gray" />
      <Suspense fallback={<TrendingUsersLoader />}>
        <TrendingUsers />
      </Suspense>

      <hr className="border-light-gray" />
      <Suspense fallback={<PostLoader />}>
        <TrendingPosts />
      </Suspense>
    </div>
  );
}
