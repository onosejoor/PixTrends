import { verifySession } from "@/lib/actions/session";
import Img from "../Img";
import { UserModal } from "./Modal";
import Link from "next/link";

export default async function TopNav() {
  const { isAuth } = await verifySession();

  return (
    <div className="xsm:hidden bg-foreground sticky top-0 z-50 flex w-full items-center justify-between px-5 py-3 backdrop-blur-sm">
      <Link href={"/"}>
        <Img
          src={"/images/logo.svg"}
          className="xs:size-12.5 size-7.5"
          alt="logo image"
        />
      </Link>
      {isAuth && <UserModal />}
    </div>
  );
}
