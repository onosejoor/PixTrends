import Img from "@/components/Img";
import Link from "next/link";

export function Post({ postId, link }: { postId: IPost; link: string }) {
  return (
    <Link
      href={link}
      className="bg-light-gray/20 border-light-gray mt-2 space-y-5 rounded-lg border p-3 transition-colors duration-200 hover:bg-white"
    >
      {postId.content && (
        <p className="text-secondary line-clamp-3 text-sm whitespace-break-spaces">
          {postId.content}
        </p>
      )}
      {postId.images.length > 0 && (
        <div className="mt-2">
          <Img
            src={postId.images[0]}
            className="h-auto max-h-40 w-full rounded-md object-cover"
            alt="Post image"
          />
        </div>
      )}
    </Link>
  );
}

export function Comment({
  commentId,
  link,
}: {
  commentId: IComment;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="bg-light-gray/20 border-light-gray mt-2 min-h-25 rounded-lg border p-3 transition-colors duration-200 hover:bg-white"
    >
      <p className="text-secondary text-sm whitespace-break-spaces">
        {commentId.content}
      </p>
    </Link>
  );
}

export function getRef(
  type: INotification["type"],
  postId: IPost | null,
  link: string,
  commentId: IComment | null,
) {
  switch (type) {
    case "like":
      return postId && <Post postId={postId} link={link} />;
    case "comment":
      return commentId && <Comment commentId={commentId} link={link} />;
    default:
      return null;
  }
}

export function getMessage(
  type: INotification["type"],
  user: INotification["sender"],
) {
  const username = (
    <Link href={`/${user.username}`} className="text-primary hover:underline font-semibold">{user.username}</Link >
  );

  switch (type) {
    case "like":
      return <p className="text-primary">{username} liked your post</p>;
    case "follow":
      return <p className="text-primary">{username} followed you</p>;
    case "reply":
      return <p className="text-primary">{username} replied to your comment</p>;
    case "comment":
      return <p className="text-primary">{username} commented on your post</p>;
    default:
      return <p className="text-primary">{username} liked your post</p>;
  }
}
