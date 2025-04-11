import { cx } from "@/components/utils";
import { backgrounds } from "./_components/bg-gradients";
import Img from "@/components/Img";
import UserPosts from "./_components/UserPostsComp";
import { User } from "@/lib/models";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Params) {
  const username = (await params).username;

  const checkUser = await User.findOne({ username });

  if (!checkUser) {
    return notFound();
  }

  const randomNumber = Math.ceil(Math.random() * 20);

  return (
    <div className="grid gap-10">
      <section>
      <div
        className={cx(
          "opacity/70 h-37.5 w-full sm:h-[200px]",
          backgrounds[randomNumber].class ??
            "bg-[#cc5500]/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPC9zdmc+')]",
        )}
      ></div>
      <header className="-mt-15 grid h-fit gap-10 px-7.5 sm:px-10">
        <div className="flex items-end gap-5">
          <Img
            src={"/images/chal.png"}
            alt="user"
            className="border-accent h-37.5 w-37.5 rounded-full border-2"
          />
          <button className="bg-primary h-fit rounded-full p-2 px-5 text-white">
            Follow
          </button>
        </div>

        <div className="*:mb-5">
          <div className="flex gap-5">
            <div className="grid gap-2">
              <b className="text-primary text-lg">Onos Ejoor</b>
              <p className="text-secondary text-sm font-medium">@Devtext16</p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="text-primary text-lg">0</b>
              <p className="text-secondary font-medium">Followers</p>
            </div>
            <div className="grid justify-items-center gap-2">
              <b className="text-primary text-lg">10</b>
              <p className="text-secondary font-medium">Following</p>
            </div>
          </div>

          <p className="text-gray">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo est
            animi cupiditate! Asperiores expedita aut rem officia incidunt quos
            commodi iusto aspernatur quae et quo minus dolore, porro distinctio
            alias.
          </p>
        </div>
      </header>        
      </section>

      <UserPosts username={username} />
    </div>
  );
}
