"use client";

import axios from "axios";
import dayjs from "dayjs";
import useSWR, { SWRConfiguration } from "swr";
import relativeTime from "dayjs/plugin/relativeTime";

import PostLoader from "@/components/loaders/PostLoader";
import EmptyState from "@/components/empty-states/PostEmptyState";

import PostCards from "../../_components/posts/PostCards";
import PostsError from "@/app/_components/posts/error";

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
  revalidateIfStale: false,
  revalidateOnFocus: false,
};

export default function UserPosts({ username, isUser }: Props) {
  const { data, isLoading, error } = useSWR<APIResponse>(
    `/api/users/${username}/posts`,
    fetcher,
    options,
  );

  if (error) {
    return <PostsError />;
  }

  if (isLoading) {
    return <PostLoader />;
  }

  const { posts } = data!;

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
    </div>
  );
}
