"use client";

import Img from "@/components/Img";
import { usePathname } from "next/navigation";

type Post = {
  user: string;
  content: string;
  images: string[];
  createdAt: string;
};

export function RecentPosts() {
  const path = usePathname();

  const protectedRoutes = ["/signin", "/signup"];

  const isProtectedRoute = protectedRoutes.some((route) => route === path);

  if (isProtectedRoute) {
    return;
  }

  return (
    <div className="border-light-gray sticky top-0 bottom-0 hidden h-screen shrink-0 flex-col gap-5 border-l-2 bg-white p-5 py-10 lg:flex lg:w-[400px]">
      <h2 className="text-primary text-lg font-semibold">Recent Posts</h2>

      <div className="grid h-fit gap-5">
        {[...Array(3)].map((_, index) => (
          <PostCards key={index} />
        ))}
      </div>
    </div>
  );
}

// { post }: { post: Partial<Post> }
const PostCards = () => {
  const content =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam aspernatur dignissimos, dolorum illum totam et ea ipsum repudiandae dolor, nobis molestias. Officia reprehenderit officiis vero facilis corrupti est ipsam quis?";

  const truncateText =
    content.length > 75 ? `${content.slice(0, 75)}...` : content;

  return (
    <article>
      <div className="xsm:shadow-post-card shadow-light-gray/50 xs:rounded-[10px] grid h-fit w-full gap-3 bg-white p-5 shadow-none">
        <div className="flex items-start gap-5">
          <Img
            src={"/images/chal.png"}
            className="size-7.5 rounded-full"
            alt="user"
          />
          <div className="grid h-fit gap-1">
            <h2 className="text-primary text-base font-semibold">DevText16</h2>
            <time className="text-accent text-xs font-medium">22mins ago</time>
          </div>
        </div>

        <p className="text-gray">{truncateText}</p>
      </div>
    </article>
  );
};
