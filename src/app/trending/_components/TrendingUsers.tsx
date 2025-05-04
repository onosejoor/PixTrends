"use client";

import Img from "@/components/Img";
import TrendingUsersLoader from "@/components/loaders/TrendingUsersLoader";

import axios from "axios";
import { Users } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { swrOptions } from "./TrendingPosts";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  users: IUser[];
};

export function TrendingUsers() {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams()

  const query = searchParams.get("query") || "";

  if (query) {
    queryParams.append("query", query)
  }

  const { data, error, isLoading } = useSWR<APIResponse>(
    `/api/trending/users?${queryParams}`,
    fetcher,
    swrOptions,
  );

  if (error) {
    return <div>error loading users</div>;
  }

  if (isLoading) {
    return <TrendingUsersLoader />;
  }

  const { users } = data!;

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Users size={20} className="text-accent" />
        <h3 className="text-primary text-lg font-semibold">Trending Users</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user._id.toString()} user={user} />
        ))}
      </div>
    </div>
  );
}

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
