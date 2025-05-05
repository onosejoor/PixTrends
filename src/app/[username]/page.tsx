import UserPosts from "./_components/UserPostsComp";
import { notFound, redirect } from "next/navigation";
import UserHeader from "./_components/UserHeader";
import { verifySession } from "@/lib/actions/session";
import { Metadata } from "next";
import { findUser } from "@/lib/actions/findData";

type Params = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const username = (await params).username;

  const checkUser = await findUser(username);

  if (!checkUser) {
    return notFound();
  }

  const { name, bio, avatar } = checkUser;

  return {
    title: {
      absolute: `${name} (${username}) on PixTrends`,
    },
    description: bio,
    openGraph: {
      title: {
        absolute: `${name} (${username}) on PixTrends`,
      },
      description: bio,
      images: avatar,
    },
  };
}

type Status = "self" | "following" | "notFollowing";

async function checkIsUser(
  username: string,
  user: IUser,
): Promise<{ status: Status }> {
  try {
    const { isAuth, username: authUsername, userId } = await verifySession();

    if (!isAuth) {
      return { status: "notFollowing" };
    }

    if (username === authUsername) {
      return { status: "self" };
    }

    const isFollowing = user?.followers.some((uid) =>
      uid.equals(userId as string),
    );

    return { status: isFollowing ? "following" : "notFollowing" };
  } catch (error) {
    console.log("[CHECK_IS_USER_ERROR]: ", error);
    return { status: "notFollowing" };
  }
}

export default async function UserPage({ params }: Params) {
  const username = (await params).username;

  const { username: authUser, isAuth } = await verifySession();

  if (!authUser && isAuth) {
    redirect("/create-username");
  }

  const checkUser = await findUser(username);

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
