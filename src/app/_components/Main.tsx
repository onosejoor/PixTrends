"use client";

import PostLoader from "@/components/loaders/PostLoader";
import useSWR, { SWRConfiguration } from "swr";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import PostCards from "./posts/PostCards";
import PostsError from "./posts/error";

dayjs.extend(relativeTime);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type APIResponse = {
  success: boolean;
  posts: IPost[];
};

const options : SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
}

export default function HomePagePosts() {
  const { data, error, isLoading } = useSWR<APIResponse>("/api/posts", fetcher, options);

  if (error) {
    return <PostsError />;
  }

  if (isLoading)
    return (
      <section className="divide-accent divide-y">
        <PostLoader />
      </section>
    );

  const { posts } = data!;

  return (
    <section className="divide-accent divide-y">
      {posts.map((post, index) => (
        <PostCards key={index} post={post} />
      ))}
    </section>
  );
}
