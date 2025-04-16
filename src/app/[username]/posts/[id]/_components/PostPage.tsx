"use client";

import LikeSection from "@/app/[username]/_components/LikeSection";
import CommentSection from "@/app/_components/Comment";
import Img from "@/components/Img";
import DynamicPostLoader from "@/components/loaders/DynamicPostLoader";
import { cx } from "@/components/utils";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  post: IPost;
  userId: string | null;
};

type Props = {
  userId: string | null;
  post: IPost;
};

const imageClass = {
  "1": "max-w-full w-full",
  "2": "max-w-[300px] w-full",
  "3": "max-w-[200px] w-full",
  "4": "max-w-[200px] w-full",
};

export default function PostPage({ postId }: { postId: string }) {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/posts/${postId}`,
    fetcher,
  );

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <DynamicPostLoader />;
  }

  const { post, userId } = data!;

  return <DynamicPostCard post={post} userId={userId} />;
}

const DynamicPostCard = ({ post, userId }: Props) => {
  const {
    user: { username, name, avatar },
    content,
    images,
    likes,
    comments,
    _id,
  } = post;

  return (
    <article className="grid gap-7 p-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-5">
          <Img
            src={avatar}
            className="size-10 rounded-full"
            alt={`${username} image`}
          />
          <div className="grid h-fit gap-1">
            <h2 className="text-primary text-lg font-semibold">{name}</h2>
            <p className="text-accent text-base font-medium">@{username}</p>
          </div>
        </div>
        <p className="text-secondary text-lg whitespace-break-spaces">
          {content}
        </p>
        {images.length > 0 && (
          <div
            className={cx(
              "no-scrollbar flex h-125 gap-5 overflow-x-scroll",
              images.length > 1 && "h-75",
            )}
          >
            {images.map((image, index) => (
              <picture
                key={index}
                className={cx(
                  "sm:shrink-0",
                  imageClass[
                    images.length.toString() as keyof typeof imageClass
                  ],
                )}
              >
                <Img
                  src={image}
                  className="rounded-[10px] object-cover size-full"
                  alt={`img-${index}`}
                />
              </picture>
            ))}
          </div>
        )}
      </div>
      <div className="grid h-fit gap-3">
        <hr className="border-light-gray" />
        <LikeSection
          userId={userId}
          likes={likes}
          comments={comments}
          postId={_id.toString()}
        />
        <hr className="border-light-gray" />
      </div>
      <CommentSection postId={_id.toString()} user={post.user} />
    </article>
  );
};
