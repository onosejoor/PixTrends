"use client";

import Img from "@/components/Img";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cx } from "@/components/utils";
import LikeSection from "../../[username]/_components/LikeSection";
import { useRouter } from "next/navigation";
import Link from "next/link";

dayjs.extend(relativeTime);

const imageClass = {
  "1": "max-w-full",
  "2": "max-w-[300px]",
  "3": "max-w-[200px]",
  "4": "max-w-[200px]",
};

const PostCards = ({
  post,
  userId,
}: {
  post: IPost;
  userId: string | null;
}) => {
  const { user, content, images, likes, comments, createdAt, _id } = post;
  const router = useRouter();

  const truncateText =
    images.length > 0 ? `${content.slice(0, 200)}...` : content;

  const handleStopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <article className="sm:p-10">
      <div
        className="sm:shadow-post-card shadow-light-gray/50 grid h-fit w-full cursor-pointer gap-6 bg-white p-5 shadow-none sm:rounded-[10px] md:max-w-[700px]"
        onClick={() => router.push(`/${user.username}/posts/${_id}`)}
      >
        <div className="flex items-start gap-5">
          <Img
            src={user.avatar}
            className="size-12.5 rounded-full"
            alt="user"
            onClick={handleStopPropagation}
          />
          <div className="grid h-fit gap-1">
            <Link
              href={`/${user.username}`}
              className="text-primary hover:underline font-semibold"
              onClick={handleStopPropagation}
            >
              {user.username}
            </Link>
            <time className="text-accent font-medium">
              {dayjs(createdAt).fromNow()}
            </time>
          </div>
        </div>

        <div className="grid gap-6">
          <p className="text-gray whitespace-break-spaces">{truncateText}</p>
          {images.length > 0 && (
            <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll">
              {images.map((image, index) => (
                <picture
                  key={index}
                  className={cx(
                    "w-full shrink-0",
                    imageClass[
                      images.length.toString() as keyof typeof imageClass
                    ],
                  )}
                  onClick={handleStopPropagation} // Cleaner function usage
                >
                  <Img
                    src={image}
                    className="h-full w-full rounded-[10px] object-cover"
                    alt={`img-${index}`}
                  />
                </picture>
              ))}
            </div>
          )}
        </div>

        <div onClick={handleStopPropagation}>
          <LikeSection
            postId={_id.toString()}
            userId={userId}
            likes={likes}
            comments={comments}
          />
        </div>
      </div>
    </article>
  );
};

export default PostCards;
