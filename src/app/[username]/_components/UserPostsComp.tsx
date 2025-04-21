"use client";

import PostLoader from "@/components/loaders/PostLoader";
import EmptyState from "@/components/empty-states/PostEmptyState";
import axios from "axios";
import dayjs from "dayjs";
import useSWR from "swr";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCards from "../../_components/posts/PostCards";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  posts: IPost[];
  userId: string | null;
};

type Props = {
  username: string;
  isUser: boolean;
};

export default function UserPosts({ username, isUser }: Props) {
  const { data, isLoading, error } = useSWR<APIResponse>(
    `/api/users/${username}/posts`,
    fetcher,
  );

  if (error) {
    return <p>error getting posts</p>;
  }

  if (isLoading) {
    return <PostLoader />;
  }

  const { posts, userId } = data!;

  return (
    <div className="grid gap-10">
      <h2 className="text-primary px-5 text-xl font-bold sm:px-10">Posts</h2>
      <hr className="border-gray" />
      <div className="divide-accent divide-y">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCards key={index} post={post} userId={userId} />
          ))
        ) : (
          <EmptyState isUser={isUser} />
        )}
      </div>
    </div>
  );
}
