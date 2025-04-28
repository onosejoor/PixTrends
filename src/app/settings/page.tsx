import { verifySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/Form";

export default async function SettingsPage() {
  const { userId, isAuth } = await verifySession();

  if (!isAuth || !userId) {
    redirect("/signin");
  }

  const userDetails = await User.findById(userId)
    .select(["avatar", "name", "email", "username", "bio", "-_id"])
    .lean();

  return <SettingsForm data={userDetails!} />;
}
