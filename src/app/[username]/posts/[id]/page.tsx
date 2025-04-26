import { Post } from "@/lib/models";
import { notFound } from "next/navigation";
import PostPage from "./_components/PostPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const findUser = await Post.findById(id).populate<{ user: IUser }>("user");

  if (!findUser) {
    return notFound();
  }

  const {
    content,
    images,
    user: { name, username, avatar },
  } = findUser;

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

  const getPost = await Post.findById(id);

  if (!getPost) {
    return notFound();
  }

  return <PostPage postId={getPost.id} />;
}
