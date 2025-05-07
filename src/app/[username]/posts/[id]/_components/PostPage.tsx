"use client";

import axios from "axios";
import useSWR from "swr";

import GoBackWithMenu from "./GoBackMenu";

import { cx } from "@/components/utils";
import Img from "@/components/Img";
import LikeSection from "@/app/[username]/_components/LikeSection";
import CommentSection from "@/app/[username]/posts/[id]/_components/comments/Comment";
import DynamicPostLoader from "@/components/loaders/DynamicPostLoader";
import Link from "next/link";
import PostsError from "@/app/_components/posts/error";
import PostCardModal from "@/app/_components/posts/modal";
import { Suspense } from "react";
import CommentLoader from "@/components/loaders/CommentLoader";
import TextHighlighter from "@/app/create/_components/TextHighlighter";
import { ImagePopup } from "@/components/ImgPopUp";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  post: IPost;
  userId: string | null;
};

type Props = {
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
    return <PostsError />;
  }

  if (isLoading) {
    return <DynamicPostLoader />;
  }

  const { post } = data!;

  return <DynamicPostCard post={post} />;
}

const DynamicPostCard = ({ post }: Props) => {
  const {
    user: { username, name, avatar },
    content,
    images,
    likes,
    comments,
    _id,
    isUser,
    views,
  } = post;

  const link = `${window.location.origin}/${username}/posts/${_id}`;

  return (
    <article className="grid gap-7 p-5">
      <GoBackWithMenu>
        <PostCardModal
          isUser={isUser}
          postId={_id.toString()}
          username={username}
        />
      </GoBackWithMenu>
      <hr className="border-light-gray/70" />
      <div className="flex flex-col gap-6">
        <Link href={`/${username}`} className="flex items-start gap-5">
          <Img
            src={avatar}
            className="size-10 rounded-full object-cover"
            alt={`${username} image`}
          />
          <div className="grid h-fit gap-1">
            <h2 className="text-primary text-lg font-semibold">{name}</h2>
            <p className="text-accent text-base font-medium">@{username}</p>
          </div>
        </Link>
        <div className="text-secondary xs:text-base text-sm sm:text-lg">
          <TextHighlighter text={content} />
        </div>

        {images.length > 0 && (
          <div
            className={cx(
              "no-scrollbar flex h-100 gap-5 overflow-x-scroll sm:h-125",
              images.length > 1 && "h-75",
            )}
          >
            {images.map((image, index) => (
              <picture
                key={index}
                className={cx(
                  "shrink-0",
                  imageClass[
                    images.length.toString() as keyof typeof imageClass
                  ],
                )}
              >
                <ImagePopup
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="size-full rounded-[10px] object-cover"
                />
              </picture>
            ))}
          </div>
        )}
      </div>
      <div className="grid h-fit gap-3">
        <hr className="border-light-gray" />
        <LikeSection
          isLiked={post.isLiked}
          link={link}
          views={views.length}
          likes={likes.length}
          comments={comments}
          postId={_id.toString()}
        />
        <hr className="border-light-gray" />
      </div>
      <Suspense fallback={<CommentLoader />}>
        <CommentSection postId={_id.toString()} />
      </Suspense>
    </article>
  );
};
