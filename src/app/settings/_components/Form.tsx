"use client";

import { FormEvent, useState, useTransition } from "react";
import { Camera, User, Mail, FileText } from "lucide-react";
import Img from "@/components/Img";
import { cx } from "@/components/utils";
import { showToast } from "@/hooks/useToast";
import { uploadImages } from "@/lib/actions/upload";
import axios from "axios";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

type Props = {
  data: Pick<IUser, "avatar" | "bio" | "email" | "name" | "username">;
};

type FormData = {
  imgFile: File | null;
  avatar: string;
  bio: string;
  email: string;
  name: string;
  username: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  username: string;
};

const SettingsForm = ({ data }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    ...data,
    imgFile: null,
  });
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const { name, email, bio, avatar, imgFile } = formData;
  const maxLength = 150;

  const isDisabled = bio.length > maxLength || pending;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    const { files, name, value } = e.target;

    if (files && files[0]) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        showToast({
          variants: "error",
          message: "Image file bigger then 2mb",
        });
        return;
      }

      setFormData((prev) => {
        return { ...prev, avatar: URL.createObjectURL(file), imgFile: file };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fields = ["name", "avatar", "email"];

    const isEmptyFields = fields.some(
      (field) => !formData[field as keyof Omit<FormData, "imgFile">].trim(),
    );

    if (isEmptyFields) {
      showToast({
        variants: "error",
        message: "All fields must be filled",
      });
      return;
    }

    const payload = {
      name,
      email,
      avatar,
      bio,
    };

    startTransition(async () => {
      if (imgFile) {
        const { success, urls, message } = await uploadImages([imgFile]);

        if (!success) {
          showToast({
            variants: "error",
            message: message!,
          });
          return;
        }

        payload.avatar = urls![0];
      }

      const sendToAPI = await axios.put<ApiResponse>("/api/users/me", payload);
      const { success, message, username } = sendToAPI.data;

      showToast({
        variants: success ? "success" : "error",
        message,
      });

      if (success) {
        mutate("/api/users/me");
        router.push(`/${username}`);
      }
    });
  }

  return (
    <div className="bg-background xs:p-6 flex items-center justify-center">
      <div className="bg-foreground xs:p-7.5 w-full max-w-3xl rounded-2xl p-5 sm:p-10">
        <div className="flex items-center gap-6">
          <div className="relative size-30">
            <Img
              src={avatar}
              alt="User Avatar"
              className="border-light-gray size-30 rounded-full border-2 object-cover brightness-50"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center rounded-full"
            >
              <Camera size={20} className="text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-secondary flex items-center gap-2 text-sm font-medium">
              <User size={16} className="text-gray" />
              Full Name
            </label>
            <input
              onChange={handleChange}
              name="name"
              value={name}
              type="text"
              placeholder="Enter your full name"
              className="border-light-gray text-primary focus:border-accent w-full rounded-md border bg-transparent py-3 pl-3 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-secondary flex items-center gap-2 text-sm font-medium">
              <Mail size={16} className="text-gray" />
              Email Address
            </label>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="border-light-gray text-primary focus:border-accent w-full rounded-md border bg-transparent py-3 pl-3 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-secondary flex items-center gap-2 text-sm font-medium">
              <FileText size={16} className="text-gray" />
              Bio
            </label>
            <div className="border-light-gray has-focus:border-accent w-full overflow-hidden rounded-md border bg-transparent p-1 has-focus:outline-none">
              <textarea
                placeholder="Tell us about yourself"
                name="bio"
                value={bio}
                onChange={handleChange}
                rows={4}
                className="text-primary w-full resize-none border-0 py-3 pl-3 outline-none"
              ></textarea>
            </div>

            <p
              className={cx("text-gray text-sm", isDisabled && "text-red-500")}
            >
              {maxLength - bio.length}
            </p>
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="bg-accent hover:bg-primary w-full rounded-full py-3 font-semibold text-white disabled:opacity-50"
          >
            {pending ? "Updating...." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
