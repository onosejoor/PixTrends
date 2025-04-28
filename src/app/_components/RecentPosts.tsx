"use client";

import Img from "@/components/Img";
import RecentPostsLoader from "@/components/loaders/RecentPostLoader";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import { usePathname } from "next/navigation";
import useSWR from "swr";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const protectedRoutes = ["/signin", "/signup"];

type APIResponse = {
  success: true;
  posts: IPost[];
};

export function RecentPosts() {
  const path = usePathname();

  const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  const isProtectedRoute = protectedRoutes.some((route) => route === path);
  const url = isProtectedRoute ? null : "/api/recents";

  const { isLoading, data, error } = useSWR<APIResponse>(url, fetcher, options);

  if (isProtectedRoute) {
    return;
  }

  if (error) {
    return (
      <div className="hidden lg:block">
        <p>error...</p>;
      </div>
    );
  }

  if (isLoading) {
    return <RecentPostsLoader />;
  }

  const { posts } = data!;

  return (
    <div className="border-light-gray sticky top-0 bottom-0 hidden h-screen shrink-0 flex-col gap-5 border-l-2 bg-white p-5 py-10 lg:flex lg:w-[400px]">
      <h2 className="text-primary text-lg font-semibold">Recent Posts</h2>

      <div className="grid h-fit gap-5">
        {posts.map((post, index) => (
          <PostCards {...post} key={index} />
        ))}
      </div>
    </div>
  );
}

const PostCards = ({ content, user, createdAt, _id }: IPost) => {
  const truncateText =
    content.length > 75 ? `${content.slice(0, 75)}...` : content;

  return (
    <Link href={`/${user.username}/posts/${_id}`}>
      <article>
        <div className="xsm:shadow-post-card shadow-light-gray/50 xs:rounded-[10px] grid h-fit w-full gap-3 bg-white p-5 shadow-none">
          <div className="flex items-start gap-5">
            <Img
              src={user.avatar}
              className="size-7.5 rounded-full"
              alt={user.name}
            />
            <div className="grid h-fit gap-1">
              <h2 className="text-primary text-base font-semibold">
                {user.username}
              </h2>
              <time className="text-accent text-xs font-medium">
                {dayjs(createdAt).fromNow()}
              </time>
            </div>
          </div>

          <p className="text-gray">{truncateText}</p>
        </div>
      </article>
    </Link>
  );
};
