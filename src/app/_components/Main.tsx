"use client";

import PostLoader from "@/components/loaders/PostLoader";
import useSWR from "swr";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import PostCards from "./posts/PostCards";

dayjs.extend(relativeTime);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type APIResponse = {
  success: boolean;
  posts: IPost[];
  userId: string;
};

export default function HomePagePosts() {
  const { data, error, isLoading } = useSWR<APIResponse>("/api/posts", fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading)
    return (
      <section className="divide-accent divide-y">
        <PostLoader />
      </section>
    );

  const { posts, userId } = data!;

  return (
    <section className="divide-accent divide-y">
      {posts.map((post, index) => (
        <PostCards key={index} post={post} userId={userId} />
      ))}
    </section>
  );
}

