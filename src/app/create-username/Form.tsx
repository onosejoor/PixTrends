"use client";

import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import { showToast } from "@/hooks/useToast";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { updateUsername } from "@/lib/actions/updateUsername";
import { validateUsername } from "@/components/utils";
import Img from "@/components/Img";

export default function CreateUsernameModal() {
  const [username, setUsername] = useState("");
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const isDisabled = !username.trim() || pending;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimedUsername = username.trim();

    if (!validateUsername(trimedUsername)) {
      showToast({
        message: "Invalid Username",
        variants: "error",
      });

      return;
    }

    startTransition(async () => {
      try {
        const { success, message } = await updateUsername(trimedUsername);

        showToast({
          message: message,
          variants: success ? "success" : "error",
        });

        if (success) {
          mutate("/api/user/me");
          router.push(`/${trimedUsername}`);
        }
      } catch (error) {
        showToast({
          message: error instanceof Error ? error.message : "Internal error",
          variants: "error",
        });
      }
    });
  }

  return (
    <div className="border-light-gray xs:w-[400px] mx-auto my-10 grid h-fit w-full gap-5 overflow-hidden rounded-[10px] border-2 bg-white">
      <form
        className="mx-auto grid h-fit w-full shrink-0 gap-10 px-5 py-10 sm:mx-0 sm:w-md sm:p-10 lg:w-full"
        onSubmit={handleSubmit}
      >
        <div className="*:my-5">
          <Img src={"/logo.svg"} alt="logo" className="block h-[55px] w-fit" />
          <div className="*:my-4">
            <h2 className="text-primary text-4xl font-bold">
              Create Username
            </h2>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="username"
              className="text-secondary text-sm font-bold"
            >
              Username
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="username"
              value={username}
              className="border-light-gray focus:border-accent rounded-lg border px-5 py-2 outline-none"
            />
          </div>

          <button
            disabled={isDisabled}
            className="bg-accent hover:bg-accent/70 w-full rounded-lg py-3 text-center font-semibold text-white disabled:opacity-70 disabled:grayscale-40"
          >
            {pending ? <ButtonLoader /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
