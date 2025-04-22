import UserPosts from "./_components/UserPostsComp";
import { User } from "@/lib/models";
import { notFound } from "next/navigation";
import UserHeader from "./_components/UserHeader";
import { veryfySession } from "@/lib/actions/session";

type Params = {
  params: Promise<{ username: string }>;
};

type Status =
  | "unauthenticated"
  | "self"
  | "following"
  | "notFollowing"
  | "error";

async function checkIsUser(
  username: string,
  user: IUser,
): Promise<{ status: Status }> {
  try {
    const { isAuth, username: authUsername, userId } = await veryfySession();

    if (!isAuth) {
      return { status: "unauthenticated" };
    }

    if (username === authUsername) {
      return { status: "self" };
    }

    const isFollowing = user?.followers.some((uid) =>
      uid.equals(userId as string),
    );

    switch (isFollowing) {
      case true:
        return { status: "following" };
      case false:
        return { status: "notFollowing" };

      default:
        return { status: "notFollowing" };
    }
  } catch (error) {
    console.log("[CHECK_IS_USER_ERROR]: ", error);
    return { status: "error" };
  }
}

export default async function UserPage({ params }: Params) {
  const username = (await params).username;

  const checkUser = await User.findOne({ username });

  if (!checkUser) {
    return notFound();
  }

  const { status } = await checkIsUser(username, checkUser);

  return (
    <div className="grid gap-10">
      <UserHeader username={username} status={status} />

      <UserPosts username={username} isUser={status === "self"} />
    </div>
  );
}
