import { notFound } from "next/navigation";
import PostPage from "./_components/PostPage";
import { Metadata } from "next";
import { verifySession } from "@/lib/actions/session";
import { findPostOne, findPostPopulate } from "@/lib/actions/findData";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const findUser = await findPostPopulate(id);

  if (!findUser) {
    return notFound();
  }

  const { content, images, user } = findUser;

  const { name, username, avatar } = user;

  return {
    title: `${name} (${username}) `,

    description: content,
    openGraph: {
      title: `${name} (${username}) `,
      description: content,
      images: images.length > 0 ? images : avatar,
    },
  };
}
export default async function DynamicPost({ params }: Props) {
  const id = (await params).id;
  const { userId } = await verifySession();

  const getPost = await findPostOne(id);

  if (!getPost) {
    return notFound();
  }
  const hasViewed =
    userId && getPost.views.some((uid) => uid.equals(userId as string));

  if (!hasViewed && !getPost.user.equals(userId as string)) {
    await getPost.updateOne({ $addToSet: { views: userId } });
  }

  return <PostPage postId={getPost.id} />;
}

