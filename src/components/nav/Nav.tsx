"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon } from "../Icons";
import Img from "../Img";
import Link from "next/link";

export default function Nav({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const navItems = [
    { name: "For You", href: "/", icon: <HomeIcon /> },
    { name: "Following", href: "/discover", icon: <SearchIcon /> },
  ];

  return (
    <aside className="border-light-gray xsm:h-full xsm:shadow-none shadow-accent xsm:w-[90px] xsm:bg-light-gray/20 fixed bottom-0 left-0 z-10 flex w-full flex-col gap-10 xsm:border-r-2 bg-white p-5 shadow-md md:w-[200px]">
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
              className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/10 rounded-[10px]"
            >
              <Link href={href} className="flex items-center sm:gap-3 xsm:p-2">
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
        {children}
      </ul>
    </aside>
  );
}
