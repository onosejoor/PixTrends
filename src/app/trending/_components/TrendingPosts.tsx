"use client";

import PostsError from "@/app/_components/posts/error";
import PostCards from "@/app/_components/posts/PostCards";
import { TrendingPostsEmptyState } from "@/components/empty-states/PostEmptyState";
import PostLoader from "@/components/loaders/PostLoader";
import axios from "axios";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR, { SWRConfiguration } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  posts: IPost[];
};

export const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenHidden: false,
};

export default function TrendingPosts() {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams();

  const query = searchParams.get("query") || "";

  if (query) {
    queryParams.append("query", query);
  }

  const { data, error, isLoading } = useSWR<APIResponse>(
    `/api/trending/posts?${queryParams}`,
    fetcher,
    swrOptions,
  );

  if (error) {
    return <PostsError />;
  }

  if (isLoading) {
    return (
      <div className="grid gap-5">
        <div className="flex items-center gap-2 px-6">
          <ChartNoAxesColumnIncreasing size={20} className="text-accent" />
          <h3 className="text-primary text-lg font-semibold">Trending Posts</h3>
        </div>
        <PostLoader />
      </div>
    );
  }

  const { posts } = data!;

  return (
    <section className="grid py-5">
      <div className="flex items-center gap-2 px-6">
        <ChartNoAxesColumnIncreasing size={20} className="text-accent" />
        <h3 className="text-primary text-lg font-semibold">Trending Posts</h3>
      </div>

      <div className="divide-accent grid gap-5 divide-y">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="py-5">
              <PostCards post={post} />
            </div>
          ))
        ) : (
          <TrendingPostsEmptyState />
        )}
      </div>
    </section>
  );
}
