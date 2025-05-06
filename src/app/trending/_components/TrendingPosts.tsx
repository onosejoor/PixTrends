"use client";

import PostsError from "@/app/_components/posts/error";
import PostCards from "@/app/_components/posts/PostCards";
import { TrendingPostsEmptyState } from "@/components/empty-states/PostEmptyState";
import BottomPostLoader from "@/components/loaders/bottom-post-loader";
import PostLoader from "@/components/loaders/PostLoader";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import axios from "axios";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  posts: IPost[];
};

export const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
};

export default function TrendingPosts() {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams();
  const BASE_URL = "/api/trending/posts";
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const query = searchParams.get("query") || "";

  if (query) {
    queryParams.append("query", query);
  }

  const { data, error, isValidating, setSize, size } =
    useSWRInfinite<APIResponse>(
      (pageIndex) => `${BASE_URL}?page=${pageIndex + 1}&limit=10&${query}`,
      fetcher,
      swrOptions,
    );

  const posts = data ? data.flatMap((page) => page.posts) : [];

  useIntersectionObserver({
    ref: loaderRef,
    isValidating,
    onIntersect: () => {
      if (!isValidating && data?.[size - 1]?.posts?.length) {
        setSize(size + 1);
      }
    },
  });

  if (error) {
    return (
      <section className="grid py-5">
        <div className="flex items-center gap-2 px-6">
          <ChartNoAxesColumnIncreasing size={20} className="text-accent" />
          <h3 className="text-primary text-lg font-semibold">Trending Posts</h3>
        </div>
        <PostsError />
      </section>
    );
  }

  if (!data && size === 1) {
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

      <BottomPostLoader ref={loaderRef} isValidating={isValidating} />
    </section>
  );
}
