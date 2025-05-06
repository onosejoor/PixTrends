"use client";

import PostLoader from "@/components/loaders/PostLoader";
import PostsError from "./posts/error";
import PostComp from "./posts/PostsComp";

export default function HomePagePosts() {
  return (
    <PostComp
      url="/api/posts"
      ErrorComp={<PostsError />}
      Loader={<PostLoader />}
    />
  );
}
