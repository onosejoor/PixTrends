import { verifySession } from "@/lib/actions/session";
import { notFound, redirect } from "next/navigation";
import CreateUsernameModal from "./Form";

export default async function CreateUsernamePage() {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect("/signin")
  }

  if (session?.username) {
    return notFound()
  }

  return <CreateUsernameModal />;
}
