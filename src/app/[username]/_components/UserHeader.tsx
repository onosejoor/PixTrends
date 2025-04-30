"use client";

import axios from "axios";
import useSWR from "swr";
import PageLoader from "../loading";
import Img from "@/components/Img";
import { backgrounds } from "./bg-gradients";
import { cx } from "@/components/utils";
import FollowBtn from "./FollowBtn";
import ProfileError from "../error";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Status = "self" | "following" | "notFollowing";

type APIResponse = {
  success: boolean;
  user: IUser;
};

type Props = {
  username: string;
  status: Status;
};

export default function UserHeader({ username, status }: Props) {
  const { data, isLoading, error, mutate } = useSWR<APIResponse>(
    `/api/users/${username}`,
    fetcher,
  );

  if (error) {
    return <ProfileError />;
  }

  if (isLoading) return <PageLoader />;

  const { user } = data!;
  const { avatar, name, following, followers, bio, _id } = user;

  const randomBg = Math.ceil(Math.random() * 20);
  const backgroundClass = backgrounds[randomBg]?.class;

  return (
    <section className="w-full">
      <div
        className={cx(
          "opacity/70 h-37.5 w-full rounded-br-[10px] rounded-bl-[10px] p-5 sm:h-[200px]",
          backgroundClass ||
            "bg-[#cc5500]/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPC9zdmc+')]",
        )}
      />

      <header className="-mt-15 grid gap-10 px-7.5 sm:px-10">
        <div className="flex items-end gap-5">
          <Img
            src={avatar}
            alt={`${name}'s avatar`}
            className="border-light-gray shadow-avatar h-37.5 w-37.5 rounded-full border-2"
          />
          <FollowBtn status={status} mutate={mutate} userId={_id.toString()} />
        </div>

        <div className="fade-in *:mb-5">
          <div className="divide-light-gray flex gap-5 divide-x">
            <div className="grid gap-2 pr-5">
              <b className="text-primary text-lg">{name}</b>
              <p className="text-secondary text-sm font-medium">@{username}</p>
            </div>

            <StatBlock label="Followers" count={followers.length} />
            <StatBlock label="Following" count={following.length} />
          </div>

          <p className="text-secondary whitespace-break-spaces">
            {bio || "This user has not created a bio yet."}
          </p>
        </div>
      </header>
    </section>
  );
}

function StatBlock({ label, count }: { label: string; count: number }) {
  return (
    <div className="grid justify-items-center gap-1 px-5">
      <b className="text-gray text-lg">{count}</b>
      <p className="text-secondary text-sm font-medium">{label}</p>
    </div>
  );
}
