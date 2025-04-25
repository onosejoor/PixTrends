"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Img from "@/components/Img";
import { cx } from "@/components/utils";
import LikeSection from "@/app/[username]/_components/LikeSection";

dayjs.extend(relativeTime);

const imageClass = {
  "1": "max-w-full",
  "2": "max-w-[300px]",
  "3": "max-w-[200px]",
  "4": "max-w-[200px]",
};

type Props = {
  post: IPost;
  userId: string | null;
};

const PostCards = ({ post, userId }: Props) => {
  const { user, content, images, likes, comments, createdAt, _id } = post;
  const router = useRouter();

  const isLengthy = images.length > 0 && content.length > 150;

  const truncateText = isLengthy ? `${content.slice(0, 150)}...` : content;

  const handleStopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const link = `${window.location.origin}/${user.username}/posts/${_id}`;

  return (
    <article className="sm:p-10">
      <div
        className="grid h-fit w-full cursor-pointer gap-6 bg-white p-5 shadow-none sm:rounded-[10px] md:max-w-[700px]"
        onClick={() => router.push(link)}
      >
        <Link href={`/${user.username}`} onClick={handleStopPropagation}>
          <div className="flex items-start gap-5">
            <Img
              src={user.avatar}
              className="size-12.5 rounded-full"
              alt="user"
            />
            <div className="grid h-fit gap-1">
              <div className="text-primary font-semibold hover:underline">
                {user.username}
              </div>
              <time className="text-accent font-medium">
                {dayjs(createdAt).fromNow()}
              </time>
            </div>
          </div>
        </Link>
        <div className="grid gap-6">
          <div>
            <p className="text-gray whitespace-break-spaces">{truncateText}</p>
            {(isLengthy || content.length > 500) && (
              <Link
                href={`/${user.username}/posts/${_id}`}
                className="text-accent text-sm underline"
              >
                See-more
              </Link>
            )}
          </div>

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
                  onClick={handleStopPropagation}
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
            link={link}
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
