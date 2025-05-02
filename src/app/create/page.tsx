import { verifySession } from "@/lib/actions/session";
import CreatePostForm from "./_components/Form";
import { User } from "@/lib/models";

export default async function CreatePostPage() {
  const { userId } = await verifySession();

  const findUser = await User.findById(userId)
    .select(["username", "avatar", "-_id"])
    .lean();

  if (!findUser) {
    throw new Error("User not found!");
  }

  return <CreatePostForm user={findUser} />;
}
