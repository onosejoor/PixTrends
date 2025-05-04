"use client";

import Img from "@/components/Img";
import RecentPostsLoader from "@/components/loaders/RecentPostLoader";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import { usePathname } from "next/navigation";
import useSWR from "swr";
import RecentPostsError from "./error";
import { SearchBar } from "../trending/_components/SearchBar";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const protectedRoutes = ["/signin", "/signup"];

type APIResponse = {
  success: true;
  data: IPost[];
};

export function RecentPosts() {
  const path = usePathname();

  const isProtectedRoute = protectedRoutes.some((route) => route === path);

  function getLink() {
    if (isProtectedRoute) {
      return null;
    }
    if (path === "/trending") {
      return "/api/recents/users";
    }
    return "/api/recents";
  }

  const url = getLink();

  const {
    isLoading,
    data: response,
    error,
  } = useSWR<APIResponse>(url, fetcher);

  if (isProtectedRoute) {
    return;
  }

  if (error) {
    return <RecentPostsError />;
  }

  if (isLoading) {
    return <RecentPostsLoader />;
  }

  const { data } = response!;

  const isTrendingRoute = path === "/trending";

  return (
    <div className="border-light-gray sticky top-0 bottom-0 hidden h-screen shrink-0 flex-col gap-5 border-l-2 bg-white p-5 py-10 lg:flex lg:w-[400px]">
      {!isTrendingRoute && (
        <div className="*:w-full">
          <SearchBar />
        </div>
      )}
      <h2 className="text-primary text-lg font-semibold">
        {url === "/api/recents" ? "Recent Posts" : "Suggested Users"}
      </h2>

      <div className="grid h-fit gap-5">{returnData(data, url!)}</div>
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
              alt={user.username}
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

          <div className="*:whitespace-normal">
            <p className="text-secondary">{truncateText}</p>
          </div>
        </div>
      </article>
    </Link>
  );
};

const UserCard = ({ user }: { user: IUserPreview }) => {
  const { followers, following, username } = user;
  return (
    <Link
      href={`/${username}`}
      className="border-light-gray hover:border-accent rounded-lg border bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <Img
          src={user.avatar}
          alt={user.name}
          className="border-accent h-12 w-12 rounded-full border-2 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-primary truncate font-semibold">{user.name}</h4>
          <p className="text-gray mb-1 text-sm">{user.username}</p>
          <p className="text-secondary mb-2 line-clamp-2 text-sm">{user.bio}</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm font-medium">
                {followers.length.toLocaleString()}
              </span>
              <span className="text-gray text-sm">followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm font-medium">
                {following.length.toLocaleString()}
              </span>
              <span className="text-gray text-sm">following</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

function returnData(data: IUserPreview[] | IPost[], route: string) {
  switch (route) {
    case "/api/recents/users":
      return (data as IUserPreview[]).map((user) => (
        <UserCard user={user} key={user._id.toString()} />
      ));
    case "/api/recents":
      return (data as IPost[]).map((post, index) => (
        <PostCards {...post} key={index} />
      ));
    default:
      break;
  }
}
