"use client";

import React, { useRef } from "react";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import PostCards from "./PostCards";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import BottomPostLoader from "@/components/loaders/bottom-post-loader";

type APIResponse = {
  success: boolean;
  posts: IPost[];
};

const fetcher = async (url: string) => axios.get(url).then((res) => res.data);

type Props = {
  url: string;
  Loader: React.JSX.Element;
  ErrorComp: React.JSX.Element;
};

export default function PostComp({ url, Loader, ErrorComp }: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, error, isValidating, setSize, size } =
    useSWRInfinite<APIResponse>(
      (pageIndex) => `${url}?page=${pageIndex + 1}&limit=10`,
      fetcher,
      { revalidateOnFocus: false },
    );

  const posts = data ? data.flatMap((page) => page.posts) : [];

  useIntersectionObserver({
    ref: loadMoreRef,
    isValidating,
    onIntersect: () => {
      if (!isValidating && data?.[size - 1]?.posts?.length) {
        setSize(size + 1);
      }
    },
  });

  if (error) {
    return ErrorComp;
  }

  if (!data && size === 1) {
    return Loader;
  }

  return (
    <div className="space-y-6">
      <section className="divide-accent divide-y">
        {posts.map((post, index) => (
          <PostCards key={index} post={post} />
        ))}
      </section>

      <BottomPostLoader ref={loadMoreRef} isValidating={isValidating} />
    </div>
  );
}
