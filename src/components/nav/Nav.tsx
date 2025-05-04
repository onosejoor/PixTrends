"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, TrendingIcon } from "../Icons";
import Img from "../Img";
import Link from "next/link";

export default function Nav({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <HomeIcon /> },
    { name: "Trending", href: "/trending", icon: <TrendingIcon /> },
  ];

  return (
    <aside className="border-light-gray xsm:h-full xsm:shadow-none shadow-accent xsm:w-[70px] xsm:bg-light-gray/20 xsm:border-r-2 xsm:px-2.5 fixed bottom-0 left-0 z-10 flex w-full flex-col gap-10 bg-white p-5 shadow-md md:w-[200px] md:px-5">
      <Link href={"/"}>
        <Img
          src={"/images/logo.svg"}
          className="xsm:block hidden size-12.5"
          alt="logo image"
        />
      </Link>
      <ul className="xsm:flex-col xsm:gap-8.5 flex flex-row justify-between sm:justify-normal">
        {navItems.map(({ name, href, icon }, index) => {
          const isActive = href === path;
          return (
            <li
              key={index}
              data-active={isActive}
              className="group xsm:data-[active=true]:bg-accent xsm:hover:bg-accent/10 rounded-[10px]"
            >
              <Link
                href={href}
                className="xsm:p-2 flex items-center justify-center sm:gap-3 md:justify-start"
              >
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
