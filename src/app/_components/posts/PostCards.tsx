"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Img from "@/components/Img";
import { cx } from "@/components/utils";
import LikeSection from "@/app/[username]/_components/LikeSection";
import PostCardModal from "./modal";
import TextHighlighter from "@/app/create/_components/TextHighlighter";

dayjs.extend(relativeTime);

const imageClass: Record<number, string> = {
  "1": "max-w-full",
  "2": "max-w-[300px]",
  "3": "max-w-[200px]",
  "4": "max-w-[200px]",
};

type Props = {
  post: IPost;
};

function PostCards({ post }: Props) {
  const {
    user,
    content,
    images,
    likes,
    views,
    comments,
    createdAt,
    _id,
    isLiked,
    isUser,
  } = post;

  const router = useRouter();

  const postUrl = `${window.location.origin}/${user.username}/posts/${_id}`;

  const isLengthy = images.length > 0 && content.length > 150;

  const displayContent = isLengthy ? `${content.slice(0, 150)}...` : content;

  const handleCardClick = () => router.push(postUrl);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <article className="sm:p-10">
      <div
        className="grid w-full max-w-3xl cursor-pointer gap-4 bg-white p-4 sm:gap-6 sm:rounded-lg sm:p-5"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between gap-5">
          <Link
            className="w-fit"
            href={`/${user.username}`}
            onClick={stopPropagation}
          >
            <div className="flex items-start gap-4">
              <Img
                src={user.avatar}
                className="size-10 xs:size-12  rounded-full object-cover"
                alt={`${user.username}'s avatar`}
              />
              <div className="grid gap-1">
                <span className="text-primary font-semibold hover:underline">
                  {user.username}
                </span>
                <time className="text-accent text-sm">
                  {dayjs(createdAt).fromNow()}
                </time>
              </div>
            </div>
          </Link>

          <div onClick={stopPropagation}>
            <PostCardModal
              isUser={isUser}
              postId={_id.toString()}
              username={user.username}
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <div className="text-secondary xs:text-base text-sm sm:text-lg">
              <TextHighlighter text={displayContent} />
            </div>

            {(isLengthy || content.length > 500) && (
              <Link
                href={postUrl}
                className="text-accent text-sm underline"
                onClick={stopPropagation}
              >
                See more
              </Link>
            )}
          </div>

          {images.length > 0 && (
            <div className="no-scrollbar flex h-64 gap-4 overflow-x-auto">
              {images.map((image, index) => (
                <picture
                  key={`${_id}-${index}`}
                  className={cx("w-full shrink-0", imageClass[images.length])}
                  onClick={stopPropagation}
                >
                  <Img
                    src={image}
                    className="h-full w-full rounded-lg object-cover"
                    alt={`Post image ${index + 1}`}
                  />
                </picture>
              ))}
            </div>
          )}
        </div>

        <div onClick={stopPropagation} className="xs:w-fit">
          <LikeSection
            link={postUrl}
            views={views.length}
            postId={_id.toString()}
            likes={likes.length}
            isLiked={isLiked}
            comments={comments}
          />
        </div>
      </div>
    </article>
  );
}

export default PostCards;
