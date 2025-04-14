"use client";

import Img from "@/components/Img";
import PostLoader from "@/components/loaders/PostLoader";
import EmptyState from "@/components/PostEmptyState";
import { likePost } from "@/lib/actions/post";
import axios from "axios";
import dayjs from "dayjs";
import { FiHeart } from "react-icons/fi";
import useSWR from "swr";
import relativeTime from "dayjs/plugin/relativeTime";
import { cx } from "@/components/utils";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

dayjs.extend(relativeTime);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type APIResponse = {
  success: boolean;
  posts: IPost[];
  userId: string | null;
};

type Props = {
  username: string;
  isUser: boolean;
};

export default function UserPosts({ username, isUser }: Props) {
  const { data, isLoading, error } = useSWR<APIResponse>(
    `/api/users/${username}/posts`,
    fetcher,
  );

  if (error) {
    return <p>error getting posts</p>;
  }

  if (isLoading) {
    return <PostLoader />;
  }

  const { posts, userId } = data!;

  return (
    <div className="grid gap-10">
      <h2 className="text-primary px-5 text-xl font-bold sm:px-10">Posts</h2>
      <hr className="border-gray" />
      <div className="divide-accent divide-y">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCards key={index} post={post} userId={userId} />
          ))
        ) : (
          <EmptyState isUser={isUser} />
        )}
      </div>
    </div>
  );
}

const PostCards = ({
  post,
  userId,
}: {
  post: IPost;
  userId: APIResponse["userId"];
}) => {
  const { user, content, images, likes, comments, createdAt, _id } = post;
  const isLiked = likes.some((id) => id.toString() === userId);

  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes.length);

  const handleClick = async () => {
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
    setLike(!like);

    await likePost(_id.toString());
  };

  const truncateText =
    images.length > 0 ? `${content.slice(0, 200)}...` : content;
  return (
    <article className="sm:p-10">
      <div className="sm:shadow-post-card shadow-light-gray/50 grid h-fit w-full gap-6 bg-white p-5 shadow-none sm:rounded-[10px] md:max-w-[700px]">
        <div className="flex items-start gap-5">
          <Img
            src={"/images/chal.png"}
            className="size-12.5 rounded-full"
            alt="user"
          />
          <div className="grid h-fit gap-1">
            <h2 className="text-primary text-lg font-semibold">
              {user.username}
            </h2>
            <time className="text-accent font-medium">
              {dayjs(createdAt).fromNow()}
            </time>
          </div>
        </div>

        <p className="text-gray whitespace-break-spaces">{truncateText}</p>
        {images.length > 0 && (
          <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll">
            {images.map((image, index) => (
              <picture key={index} className="max-w-[300px] shrink-0">
                <Img
                  src={image}
                  className="h-full w-full rounded-[10px] object-cover"
                  alt={`img-${index}`}
                />
              </picture>
            ))}
          </div>
        )}

        <div className="flex items-center gap-7.5">
          <div
            role="button"
            onClick={handleClick}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <div className="p-2 group hover:bg-accent/10 rounded-full">
              <FiHeart
                className={cx(
                  "active:fill-accent hover:stroke-accent stroke-gray active:stroke-accent size-5",
                  like && "fill-accent stroke-accent",
                )}
              />
            </div>

            <span className="text-secondary -ml-2">{likeCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="p-2 group hover:bg-accent/10 rounded-full">
              <MessageSquare className="stroke-gray hover:stroke-accent" />
            </div>
            <span className="text-secondary -ml-2">{comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
