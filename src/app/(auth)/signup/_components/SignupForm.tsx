"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn } from "next-auth/react";

import OtpField from "./OtpField";

import { GoogleIcon } from "@/components/Icons";
import Img from "@/components/Img";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { showToast } from "@/hooks/useToast";
import { sendOTP, resendOtp, verifyOtp } from "@/lib/actions/OTP";
import { validateUsername } from "@/components/utils";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

type IFormData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

type Response = {
  success: boolean;
  message: string;
};

export default function SignUpForm() {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);

  const { name, email, username, password } = formData;

  const isDisabled = !name || !email || !username || !password;

  const router = useRouter()


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

    let isEmptyFields = false;

    const inputKeys = Object.keys(formData);

    inputKeys.forEach((key) => {
      if (!formData[key as keyof IFormData].trim()) {
        isEmptyFields = true;
        return;
      }
    });

    if (isEmptyFields) {
      showToast({
        message: "All inputs must be filled",
        variants: "error",
      });
      setLoading(false);
      return;
    }

    if (!validateUsername(username)) {
      showToast({
        message: "Invalid Username",
        variants: "error",
      });

      return;
    }

    try {
      const postOtp = await sendOTP(email, username);

      showToast({
        message: postOtp.message,
        variants: postOtp.success ? "success" : "error",
      });

      if (postOtp?.success) {
        setShowOtpField(true);
      }
    } catch (error: any) {
      const { data } = error.response;
      showToast({
        message: data.message || error.message,
        variants: "error",
      });
    }
    setLoading(false);
  }

  async function handleResendOtp() {
    try {
      const postOtp = await resendOtp(email);

      if (postOtp?.success) {
        showToast({
          message: postOtp.message,
          variants: "success",
        });
        setShowOtpField(true);
      }
    } catch (error) {
      console.log("[SEND_FORMDATA_TO_SERVER_ERROR]: %d", error);
    }
  }

  async function handleSubmitOtpAndSave(otp: string) {
    try {
      const checkOtp = await verifyOtp(email, otp);

      if (!checkOtp.success) {
        showToast({
          variants: "error",
          message: checkOtp.message,
        });
        return;
      }
      const sendForm = await axios.post<Response>("/api/auth/signup", formData);

      const serverResponse = sendForm.data;

      showToast({
        variants: serverResponse.success ? "success" : "error",
        message: serverResponse.message,
      });

      if (serverResponse.success) {
        await mutate("/api/users/me")
        router.push("/")
      }
    } catch (error) {
      console.log("[SERVER_SIGNUP_POST_ERROR]: " + error);

      showToast({
        variants: "error",
        message: "Internal Server Error, try again",
      });
    }
  }

  const handleGoogle = () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <div className="border-light-gray grid h-fit w-full grid-cols-1 gap-5 overflow-hidden rounded-[10px] border-2 bg-white md:grid-cols-[1.5fr_2fr]">
      {showOtpField ? (
        <OtpField
          handleResend={handleResendOtp}
          handleSaveUser={handleSubmitOtpAndSave}
        />
      ) : (
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
                Sign up to
                <span className="font-cherry text-primary font-bold">
                  {" "}
                  PixTrends
                </span>
              </h2>
              <div className="font-medium">
                <p className="text-secondary/80">
                  Already Have An Account?{" "}
                  <span>
                    <Link
                      href={"/signin"}
                      className="text-primary text-lg font-semibold"
                    >
                      Sign-In
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-secondary text-sm font-bold"
              >
                Your Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="name"
                className="border-light-gray focus:border-accent rounded-lg border px-5 py-2 outline-none"
              />
            </div>
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
                className="border-light-gray focus:border-accent rounded-lg border px-5 py-2 outline-none"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-secondary text-sm font-bold"
              >
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
              {loading ? <ButtonLoader /> : "Sign Up"}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <hr className="border-light-gray w-full" />
            <b className="text-primary shrink-0">Or sign up with</b>
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
      )}

      <Img
        src={"/images/auth-form-bg.webp"}
        alt="ai generatie story robot"
        className="hidden h-full object-cover md:block"
      />
    </div>
  );
}
