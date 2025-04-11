"use client";

import axios from "axios";
import useSWR from "swr";
import Spinner from "./loaders/Spinner";
import {
  CreateIcon,
  NotificationIcon,
  ProfileIcon,
  SignInIcon,
  SignUpIcon,
} from "./Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

const fetcher = async (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  message?: string;
  userId?: string;
  username: string;
};

export default function UserNavComp() {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    "/api/users/me",
    fetcher,
  );
  const path = usePathname();

  if (error) {
    console.log(error);
    
    if (error.status === 401) {
      return <AuthLinks path={path} />;
    }
    return <div>Error loading user data</div>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  const { username } = data!;

  const userLinks = [
    { name: "Create", href: "/create", icon: <CreateIcon /> },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <NotificationIcon />,
    },
    { name: "Profile", href: `/${username}`, icon: <ProfileIcon /> },
  ];

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
    </>
  );
}

const AuthLinks = ({path}: {path: string}) => {
  const authLinks = [
    { name: "Signin", href: "/signin", icon: <SignInIcon /> },
    { name: "Signup", href: "/signup", icon: <SignUpIcon /> },
  ];

  return (
    <>
      {authLinks.map(({ name, href, icon }, index) => {
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
      })}
    </>
  );
};
