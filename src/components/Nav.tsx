"use client";

import { usePathname } from "next/navigation";
import {
  CreateIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  SearchIcon,
} from "./Icons";
import Img from "./Img";
import Link from "next/link";

export default function Nav() {
  const path = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <HomeIcon /> },
    { name: "Discover", href: "/discover", icon: <SearchIcon /> },
    { name: "Create", href: "/create", icon: <CreateIcon /> },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <NotificationIcon />,
    },
    { name: "Profile", href: "/profile", icon: <ProfileIcon /> },
  ];

  return (
    <nav className="border-light-gray xsm:h-full xsm:shadow-none shadow-accent xsm:w-[90px] fixed bottom-0 left-0 flex w-full flex-col gap-10 border-r-2 bg-white xsm:bg-light-gray/20 z-10 p-5 shadow-md md:w-[200px]">
      <Img
        src={"/images/logo.svg"}
        className="xsm:block hidden size-12.5"
        alt="logo image"
      />
      <ul className="xsm:flex-col xsm:gap-8.5 xsm:py-5 flex flex-row justify-between sm:justify-normal">
        {navItems.map(({ name, href, icon }, index) => {
          const isActive = href === path;
          return (
            <li
              key={index}
              data-active={isActive}
              className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/50 xsm:p-2 rounded-[10px]"
            >
              <Link href={href} className="flex items-center sm:gap-3">
                <div className="grid justify-items-center gap-1.5">
                  {icon}
                  {isActive && (
                    <div className="bg-accent xsm:hidden block h-1 w-1 rounded-full"></div>
                  )}
                </div>
                <span className="group-data-[active=true]:text-foreground group-hover:text-primary text-gray hidden font-medium md:block">
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
