"use client";

import axios from "axios";
import useSWR, { SWRConfiguration } from "swr";
import Spinner from "../loaders/Spinner";
import {
  CreateIcon,
  NotificationIcon,
  ProfileIcon,
  SignInIcon,
  SignUpIcon,
} from "../Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { eventEmitter } from "@/lib/eventEmitter";
import { AlignLeft } from "lucide-react";

const fetcher = async (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  message?: string;
  userId?: string;
  username: string;
  unreadNotifications: number;
};

const options: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default function UserNavComp() {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    "/api/users/me",
    fetcher,
    options,
  );
  const [notificationCount, setNotificationCount] = useState(0);

  const path = usePathname();
  const notificationActive = "/notifications" === path;

  const username = data?.username || "";

  const userLinks = useMemo(
    () => [
      { name: "Create", href: "/create", icon: <CreateIcon /> },
      { name: "Profile", href: `/${username}`, icon: <ProfileIcon /> },
    ],
    [username],
  );

  useEffect(() => {
    setNotificationCount(data?.unreadNotifications || 0);

    const notificationListener = () => {
      setNotificationCount((prev) => prev + 1);
    };
    const resetListener = () => {
      setNotificationCount(0);
    };

    eventEmitter.on("notification", notificationListener);
    eventEmitter.on("reset", resetListener);

    return () => {
      eventEmitter.off("notification", notificationListener);
      eventEmitter.off("reset", resetListener);
    };
  }, [data]);

  if (error) {
    if (error.status === 401) {
      return <AuthLinks path={path} />;
    }
    return <div>Error loading user data</div>;
  }

  if (isLoading) {
    return (
      <div className="xsm:self-start self-center">
        <Spinner />
      </div>
    );
  }

  const isUnread = notificationCount > 0;

  return (
    <>
      {userLinks.map(({ name, href, icon }, index) => {
        const isActive = href === path;
        return (
          <li
            key={index}
            data-active={isActive}
            className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/10 rounded-[10px]"
          >
            <Link href={href} className="xsm:p-2 flex items-center sm:gap-3">
              <div className="grid justify-items-center gap-1.5">
                {icon}
                {isActive && (
                  <div className="bg-accent xsm:hidden block h-1 w-1 rounded-full"></div>
                )}
              </div>
              <span className="group-data-[active=true]:text-foreground text-gray hidden font-medium md:block">
                {name}
              </span>
            </Link>
          </li>
        );
      })}
      <li
        data-active={notificationActive}
        className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/10 rounded-[10px]"
      >
        <Link
          href={"/notifications"}
          className="xsm:p-2 flex items-center sm:gap-3"
        >
          <div className="grid justify-items-center gap-1.5">
            <div className="relative">
              <NotificationIcon />
              {isUnread && (
                <span className="bg-accent absolute top-[5px] right-[5px] flex h-[10px] w-[10px] items-center justify-center rounded-full text-white group-data-[active=true]:bg-blue-400">
                  &nbsp;
                </span>
              )}
            </div>

            {notificationActive && (
              <div className="bg-accent xsm:hidden block h-1 w-1 rounded-full"></div>
            )}
          </div>
          <span className="group-data-[active=true]:text-foreground text-gray hidden font-medium md:block">
            Notifications
          </span>
        </Link>
      </li>

      <button className="absolute bottom-5 mt-auto">
        <AlignLeft className="text-gray size-10" />
      </button>
    </>
  );
}

const AuthLinks = ({ path }: { path: string }) => {
  const authLinks = [
    { name: "Signin", href: "/signin", icon: <SignInIcon /> },
    { name: "Signup", href: "/signup", icon: <SignUpIcon /> },
  ];

  return authLinks.map(({ name, href, icon }, index) => {
    const isActive = href === path;
    return (
      <li
        key={index}
        data-active={isActive}
        className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/20 rounded-[10px]"
      >
        <Link href={href} className="xsm:p-2 flex items-center sm:gap-3">
          <div className="grid justify-items-center gap-1.5">
            {icon}
            {isActive && (
              <div className="bg-accent xsm:hidden block h-1 w-1 rounded-full"></div>
            )}
          </div>
          <span className="group-data-[active=true]:text-foreground text-gray hidden font-medium md:block">
            {name}
          </span>
        </Link>
      </li>
    );
  });
};
