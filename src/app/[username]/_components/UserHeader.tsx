"use client";

import axios from "axios";
import useSWR from "swr";
import PageLoader from "../loading";
import Img from "@/components/Img";
import { backgrounds } from "./bg-gradients";
import { cx } from "@/components/utils";
import Link from "next/link";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Status =
  | "unauthenticated"
  | "self"
  | "following"
  | "notFollowing"
  | "error";

type APIResponse = {
  success: boolean;
  user: IUser;
};

export default function UserHeader({
  username,
  status,
}: {
  username: string;
  status: Status;
}) {
  const { data, isLoading, error } = useSWR<APIResponse>(
    `/api/users/${username}`,
    fetcher,
  );

  if (error) {
    return <p>error....</p>;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const randomNumber = Math.ceil(Math.random() * 20);

  const { user } = data!;

  const { avatar, name, following, folowers, bio } = user;
  
  return (
    <section>
      <div
        className={cx(
          "opacity/70 h-37.5 w-full sm:h-[200px]",
          backgrounds[randomNumber]?.class ||
            "bg-[#cc5500]/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPC9zdmc+')]",
        )}
      ></div>
      <header className="-mt-15 grid h-fit gap-10 px-7.5 sm:px-10">
        <div className="flex items-end gap-5">
          <Img
            src={avatar}
            alt={`${name} avatar image`}
            className="border-accent h-37.5 w-37.5 rounded-full border-2"
          />
          {switchStatus(status)}
        </div>

        <div className="*:mb-5">
          <div className="flex gap-5">
            <div className="grid gap-2">
              <b className="text-primary text-lg">{name}</b>
              <p className="text-secondary text-sm font-medium">{username}</p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="text-primary text-lg">{folowers.length}</b>
              <p className="text-secondary font-medium">Followers</p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="text-primary text-lg">{following.length}</b>
              <p className="text-secondary font-medium">Following</p>
            </div>
          </div>

          <p className="text-gray">
            {bio || "This user Has not created a bio yet"}
          </p>
        </div>
      </header>
    </section>
  );
}

function switchStatus(status: Status) {
  const generalClassname = "bg-primary h-fit rounded-full p-2 px-5 text-white";
  switch (status) {
    case "notFollowing":
      return <button className={generalClassname}>Follow</button>;
    case "following":
      return <button className={generalClassname}>Unfollow</button>;
    case "self":
      return (
        <Link href={"/settings"} className={generalClassname}>
          Edit Profile
        </Link>
      );
    case "error":
      return <button className={generalClassname}>Follow</button>;
    case "unauthenticated":
      return <button className={generalClassname}>Follow</button>;

    default:
      return <button className={generalClassname}>Follow</button>;
  }
}
