"use client";

import Img from "@/components/Img";
import { showToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
  useTransition,
} from "react";
import { FaImage } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import CharCount from "./CharCount";

type FormData = {
  imagesUrl: string[];
  imageFiles: File[] | null;
  text: string;
};

type APIResponse = {
  success: boolean;
  message: string;
  link: string;
};

type Props = {
  user: {
    username: string;
    avatar: string;
  };
};

export default function CreatePostForm({ user }: Props) {
  const [formData, setFormData] = useState<FormData>({
    text: "",
    imagesUrl: [],
    imageFiles: null,
  });
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const goBack = () => router.back();

  const { imagesUrl, imageFiles, text } = formData;

  const isDisabled = (!text.trim() && imagesUrl.length < 1) || pending;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
  ) => {
    const { files } = e.target;
    const maxFileSize = 2.5 * 1024 * 1024;
    const isValidImage = (file: File) => file.size <= maxFileSize;

    if (files && files.length) {
      const fileLists = Array.from(files);
      const remainingSlots = 4 - imagesUrl.length;

      const newImagesUrl: string[] = [];
      const newImageFiles: File[] = [];

      for (let i = 0; i < Math.min(fileLists.length, remainingSlots); i++) {
        const file = fileLists[i];

        if (!isValidImage(file)) {
          showToast({
            message: "File size is greater than 2MB",
            variants: "error",
          });
          continue;
        }

        newImagesUrl.push(URL.createObjectURL(file));
        newImageFiles.push(file);
      }

      setFormData((prev) => ({
        ...prev,
        imagesUrl: [...prev.imagesUrl, ...newImagesUrl],
        imageFiles: prev.imageFiles
          ? [...prev.imageFiles, ...newImageFiles]
          : newImageFiles,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        text: e.target.value,
      }));
    }
  };

  const removeImage = useCallback(
    (idx: number) => {
      setFormData((prev) => {
        const newImagesUrl = [...prev.imagesUrl];
        const newImageFiles = [...prev.imageFiles!];

        newImagesUrl.splice(idx, 1);
        newImageFiles.splice(idx, 1);

        URL.revokeObjectURL(prev.imagesUrl[idx]);

        return {
          ...prev,
          imagesUrl: newImagesUrl,
          imageFiles: newImageFiles,
        };
      });
    },
    [setFormData],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const formData = new FormData();

        if (imageFiles && imageFiles.length > 0) {
          for (const file of imageFiles) {
            formData.append("images", file);
          }
        }
        formData.append("text", text);

        const sendFormToApi = await axios.post<APIResponse>(
          "/api/posts",
          formData,
        );
        const response = sendFormToApi.data;
        showToast({
          message: response.message,
          variants: response.success ? "success" : "error",
        });
        if (response.success) {
          setFormData({
            imagesUrl: [],
            imageFiles: null,
            text: "",
          });
          router.push(response.link);
        }
      } catch (error) {
        console.error("Error creating post:", error);
        showToast({
          message: "Failed to create post. Please try again.",
          variants: "error",
        });
      }
    });
  }

  return (
    <div>
      <div
        className="bg-light-gray/50 fixed inset-0 z-15 backdrop-blur-sm"
        onClick={goBack}
      ></div>
      <form
        onSubmit={handleSubmit}
        className="xsm:h-fit xsm:w-[500px] xsm:max-h-[calc(100%_-_50px)] fixed top-1/2 left-1/2 z-20 flex h-full min-h-[300px] w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-[10px] bg-white p-5"
      >
        <div className="mb-3 flex justify-between">
          <h2 className="text-primary font-semibold">Create Post</h2>
          <ImCancelCircle onClick={goBack} cursor={"pointer"} fill="red" />
        </div>
        <div className="flex items-start gap-3">
          <Img
            src={user.avatar}
            className="size-10 rounded-full"
            alt={user.username}
            loading="lazy"
          />
          <div className="grid h-fit w-full gap-5">
            <h2 className="text-primary text-sm font-semibold">
              {user.username}
            </h2>
            <TextareaAutosize
              onChange={handleChange}
              name="text"
              value={text}
              cacheMeasurements
              className="border-gray focus:border-accent text-gray resize-none border-b outline-none"
              placeholder="What's trending?"
              minRows={2}
              maxRows={7}
            />
          </div>
        </div>

        {imagesUrl.length > 0 && (
          <div className="no-scrollbar flex h-[250px] gap-5 overflow-x-scroll py-5">
            {imagesUrl.map((image, index) => (
              <picture
                key={index}
                className="animate-in zoom-in relative w-[200px] shrink-0"
              >
                <Img
                  src={image}
                  className="h-full w-full rounded-[10px] object-cover"
                  alt={`img-${index}`}
                />
                <div className="absolute -top-2.5 -right-2.5 rounded-full bg-red-500 p-1">
                  <MdCancel
                    onClick={() => removeImage(index)}
                    cursor={"pointer"}
                    className="size-5"
                    fill="white"
                  />
                </div>
              </picture>
            ))}
          </div>
        )}

        <div className="xsm:mt-auto flex items-center justify-between gap-5">
          <label id="file" htmlFor="user_images" className="group w-fit">
            <input
              onChange={handleChange}
              type="file"
              disabled={imageFiles?.length === 4}
              name="imageFiles"
              multiple
              className="hidden"
              id="user_images"
            />
            <FaImage className="fill-gray group-hover:fill-accent size-5 cursor-pointer" />
          </label>
          <CharCount text={text} loading={pending} disabled={isDisabled} />
        </div>
      </form>
    </div>
  );
}
