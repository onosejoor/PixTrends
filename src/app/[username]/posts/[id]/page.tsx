import { Post } from "@/lib/models";
import { notFound } from "next/navigation";
import PostPage from "./_components/PostPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DynamicPost({ params }: Props) {
  const id = (await params).id;

  const getPost = await Post.findById(id);

  if (!getPost) {
    return notFound();
  }

  return <PostPage postId={getPost.id} />;
}
