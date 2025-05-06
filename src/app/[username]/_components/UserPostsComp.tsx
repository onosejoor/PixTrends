"use client";

import axios from "axios";
import dayjs from "dayjs";
import { SWRConfiguration } from "swr";
import relativeTime from "dayjs/plugin/relativeTime";

import PostLoader from "@/components/loaders/PostLoader";
import EmptyState from "@/components/empty-states/PostEmptyState";

import PostCards from "../../_components/posts/PostCards";
import PostsError from "@/app/_components/posts/error";
import useSWRInfinite from "swr/infinite";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useRef } from "react";
import BottomPostLoader from "@/components/loaders/bottom-post-loader";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  posts: IPost[];
};

type Props = {
  username: string;
  isUser: boolean;
};

const options: SWRConfiguration = {
  revalidateOnFocus: false,
};

export default function UserPosts({ username, isUser }: Props) {
  const BASE_URL = `/api/users/${username}/posts`;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, error, isValidating, setSize, size } =
    useSWRInfinite<APIResponse>(
      (pageIndex) => `${BASE_URL}?page=${pageIndex + 1}&limit=5`,
      fetcher,
      options,
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
    return <PostsError />;
  }

  if (!data && size === 1) {
    return <PostLoader />;
  }

  return (
    <div className="grid">
      <div className="grid *:mb-2">
        <h2 className="text-primary px-5 text-xl font-bold sm:px-10">Posts</h2>
        <hr className="border-light-gray w-25" />
      </div>
      <div className="divide-accent divide-y">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const updatedPost = { ...post, isUser };
            return <PostCards key={index} post={updatedPost} />;
          })
        ) : (
          <EmptyState isUser={isUser} />
        )}
      </div>
      <BottomPostLoader ref={loadMoreRef} isValidating={isValidating} />
    </div>
  );
}
