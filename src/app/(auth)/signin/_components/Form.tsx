"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { GoogleIcon } from "@/components/Icons";
import Img from "@/components/Img";
import { showToast } from "@/hooks/useToast";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

type IFormData = {
  email: string;
  password: string;
};

type Response = {
  success: boolean;
  message: string;
};

export default function SignInForm() {
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const isDisabled = !email || !password;

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const inputKeys = Object.keys(formData);

    const isEmpty = inputKeys.some(
      (key) => !formData[key as keyof IFormData].trim(),
    );

    if (isEmpty) {
      showToast({
        variants: "error",
        message: "All inputs must be filled",
      });
      setLoading(false);
      return;
    }

    try {
      const sendForm = await axios.post<Response>("/api/auth/signin", formData);

      const serverResponse = sendForm.data;

      if (serverResponse.success) {
        await mutate("/api/users/me");
        router.push("/");
      }

      showToast({
        variants: serverResponse.success ? "success" : "error",
        message: serverResponse.message,
      });
    } catch (error: any) {
      const { data } = error.response;
      showToast({
        variants: "error",
        message: data.message || error.message,
      });
    }
    setLoading(false);
  }

  const handleGoogle = () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <div className="border-light-gray grid h-fit w-full grid-cols-1 gap-5 overflow-hidden rounded-[10px] border-2 bg-white md:grid-cols-[1.5fr_2fr]">
      <form
        className="mx-auto grid h-fit w-full shrink-0 gap-10 px-5 py-10 sm:mx-0 sm:w-md sm:p-10 lg:w-full"
        onSubmit={handleSubmit}
      >
        <div className="*:my-5">
          <Img
            src={"/images/logo.svg"}
            alt="logo"
            className="block h-[55px] w-fit"
          />

          <div className="*:my-4">
            <h2 className="text-secondary text-4xl font-bold">
              Sign in to
              <span className="font-cherry text-primary font-bold">
                {" "}
                PixTrends
              </span>
            </h2>
            <div className="font-medium">
              <p className="text-secondary/80">
                Don&apos;t Have An Account?{" "}
                <span>
                  <Link
                    href={"/signup"}
                    className="text-primary text-lg font-semibold"
                  >
                    Sign-Up
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-secondary text-sm font-bold">
              Email Address
            </label>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              className="border-light-gray focus:border-accent rounded-lg border px-5 py-2 outline-none"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="password"
              className="text-secondary text-sm font-bold"
            >
              Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              name="password"
              className="border-light-gray focus:border-accent rounded-lg border px-5 py-2 outline-none"
            />
          </div>
          <button
            disabled={isDisabled || loading}
            className="bg-accent hover:bg-accent/70 w-full rounded-lg py-3 text-center font-semibold text-white disabled:!cursor-not-allowed disabled:opacity-70 disabled:grayscale-40"
          >
            {loading ? <ButtonLoader /> : "Sign In"}
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <hr className="border-light-gray w-full" />
          <b className="text-primary shrink-0">Or sign in with</b>
          <hr className="border-light-gray w-full" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="border-accent text-secondary disabled:bg-secondary/50 flex items-center justify-center gap-2 rounded-[10px] border-2 px-5 py-2 text-lg disabled:!cursor-not-allowed disabled:opacity-70 disabled:grayscale-40"
        >
          {loading ? (
            <ButtonLoader />
          ) : (
            <>
              <span className="shrink-0">
                <GoogleIcon />
              </span>
              Google
            </>
          )}
        </button>
      </form>
      <Img
        src={"/images/auth-form-bg.webp"}
        alt="ai generatie story robot"
        className="hidden h-full object-cover md:block"
      />
    </div>
  );
}
