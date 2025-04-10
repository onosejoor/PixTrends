"use client";

import { CommentIcon, HeartIcon } from "@/components/Icons";
import Img from "@/components/Img";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Post = {
  user: string;
  content: string;
  images: string[];
  likes: string[];
  comments: number;
  createdAt: string;
};

type APIResponse = {
  success: boolean;
  posts: Post[];
};

export default function HomePagePosts() {
  const { data, error, isLoading } = useSWR<APIResponse>("/api/posts", fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const { posts } = data!;

  return (
    <section className="divide-accent divide-y">
      {posts.map((post, index) => (
        <PostCards key={index} post={post} />
      ))}
    </section>
  );
}

const PostCards = ({ post }: { post: Post }) => {
  const { user, content, images, likes, comments } = post;

  const truncateText = images.length ? content.slice(0, 100) : content;
  return (
    <article className="sm:p-10">
      <div className="xsm:shadow-post-card shadow-none shadow-light-gray/50 grid h-fit w-full gap-6 xs:rounded-[10px] bg-white p-5 md:max-w-[700px]">
        <div className="flex items-start gap-5">
          <Img
            src={"/images/chal.png"}
            className="size-12.5 rounded-full"
            alt="user"
          />
          <div className="grid h-fit gap-1">
            <h2 className="text-primary text-lg font-semibold">{user}</h2>
            <time className="text-accent font-medium">22mins ago</time>
          </div>
        </div>

        <p className="text-gray">{truncateText}</p>
        <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll">
          {images.map((image, index) => (
            <picture key={index} className="shrink-0">
              <Img
                src={image}
                className="h-full w-full rounded-[10px] object-cover"
                alt={`img-${index}`}
              />
            </picture>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-7.5">
          <div className="flex items-center gap-1.5">
            <HeartIcon /> <span className="text-secondary">{likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CommentIcon /> <span className="text-secondary">{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
