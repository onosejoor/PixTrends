import { verifySession } from "@/lib/actions/session";
import SignInForm from "./_components/Form";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const { isAuth } = await verifySession();

  if (isAuth) {
    redirect("/");
  }
  return (
    <div className="sm:p-10">
      <SignInForm />
    </div>
  );
}
