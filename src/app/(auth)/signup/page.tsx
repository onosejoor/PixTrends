import { redirect } from "next/navigation";
import SignUpForm from "./_components/SignupForm";
import { verifySession } from "@/lib/actions/session";

export default async function SigninPage() {
  const { isAuth } = await verifySession();

  if (isAuth) {
    redirect("/");
  }
  return (
    <div className="sm:p-10">
      <SignUpForm />
    </div>
  );
}
