import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { setInterval, clearInterval } from "worker-timers";

import { showToast } from "@/hooks/useToast";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import Img from "@/components/Img";

type LoaderProps = "resend" | "submit";

export default function OtpField({
  handleResend,
  handleSaveUser,
}: {
  handleSaveUser: (otp: string) => Promise<void>;
  handleResend: () => Promise<void>;
}) {
  const [otpInputs, setOtpInputs] = useState<string[]>(Array(6).fill(""));
  const [timeRemaining, setTimeRemaining] = useState(60 * 5);
  const [loader, setLoader] = useState<LoaderProps | false>(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const isLoading = loader === "submit" || loader === "resend";

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining]);

  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { value } = e.target;


    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);

    if (index < 6 - 1 && value) {
      inputs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpInputs[index].trim() && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d*$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtpInputs(newOtp);

    newOtp.forEach((otp, index) => {
      if (inputs.current[index]) {
        inputs.current[index].value = otp;

        inputs.current[index + 1]?.focus();
      }
    });
  };

  const resendOtpFunction = async () => {
    setLoader("resend");
    await handleResend();
    setTimeRemaining(60 * 5);
    setOtpInputs(Array(6).fill(""));
    inputs.current = [];
    setLoader(false);
    return;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoader("submit");

    const isEmptyInput = otpInputs.some((otp) => !otp.trim());

    if (isEmptyInput) {
      showToast({
        variants: "error",
        message: "OTP Inputs must be filled",
      });
      setLoader(false);
      return;
    }

    let otpInString = "";

    otpInputs.forEach((input) => (otpInString += input));
    try {
      await handleSaveUser(otpInString);
    } catch (error: any) {
      showToast({
        variants: "error",
        message: error.message,
      });
    }
    setLoader(false);
  }

  return (
    <form className="m-auto grid gap-10 p-5 md:p-10" onSubmit={handleSubmit}>
      <div className="*:my-5">
        <Img
          src={"/images/logo.svg"}
          alt="logo"
          className="block h-[55px] w-fit"
        />

        <div className="*:my-4">
          <h2 className="text-secondary text-4xl font-bold">
            Verify Your Email
          </h2>
          <p className="text-secondary/80 font-medium">
            We have sent a verification code to your email. expires in 5 minutes
          </p>
        </div>
      </div>

      <div
        className="mx-auto flex w-fit items-center gap-3"
        onPaste={handlePaste}
      >
        {otpInputs.map((_, index) => (
          <input
            key={index}
            type="text"
            value={otpInputs[index]}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            name="otp_input"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="text-secondary border-secondary/50 focus:border-accent h-10 w-10 border-b-2 p-3 text-center outline-none"
            maxLength={1}
          />
        ))}
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="bg-accent hover:bg-accent/70 w-full rounded-lg py-3 text-center font-semibold text-white disabled:!cursor-not-allowed disabled:opacity-70 disabled:grayscale-40"
      >
        {loader === "submit" ? <ButtonLoader /> : "Verify Email"}
      </button>

      {timeRemaining === 0 ? (
        <button
          disabled={isLoading}
          type="button"
          onClick={resendOtpFunction}
          className="bg-primary hover:bg-primary/70 w-full mx-auto rounded-lg px-5 py-3 text-center font-semibold text-white disabled:!cursor-not-allowed disabled:opacity-70 disabled:grayscale-40"
        >
          {loader === "resend" ? <ButtonLoader /> : "Resend OTP"}
        </button>
      ) : (
        <p className="text-secondary/80 capitalize">
          You can Resend the Otp in:{" "}
          <span className="text-accent font-medium">{`${minutes} : ${seconds}`}</span>
        </p>
      )}
    </form>
  );
}
