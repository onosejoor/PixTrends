import Img from "@/components/Img";
import Spinner from "@/components/loaders/Spinner";
import { cx } from "@/components/utils";
import { showToast } from "@/hooks/useToast";
import axios, { AxiosError } from "axios";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import TextAreaAutoRezise from "react-textarea-autosize";
import { mutate } from "swr";

type ServerResponse = {
  success: boolean;
  message: string;
};

type CommentProps = {
  parentId?: string | null;
  postId: string;
  currentUser: IUserPreview;
  reply?: boolean;
};

export default function CommentForm({
  parentId,
  postId,
  currentUser,
  reply,
}: CommentProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const maxLength = 300;

  const isDisabled = !text.trim() || text.length > maxLength || loading;

  const textColor = text.length > maxLength ? "text-red-500" : "text-gray";

  async function submitCondition(e: FormEvent) {
    if (reply) {
      return await handleSubmit(e);
    }
    return await handleEdit(e);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const postComment = await axios.post<ServerResponse>("/api/comments", {
        text,
        postId,
        parentId,
      });
      const response = postComment.data;

      showToast({
        variants: response.success ? "success" : "error",
        message: response.message,
      });

      if (response.success) {
        setText("");
        mutate("/api/comments");
      }
    } catch (error) {
      console.log("error creating comments: ", error);

      showToast({
        variants: "error",
        message:
          error instanceof AxiosError
            ? (error.response?.statusText as string)
            : "Error creating comment",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const postComment = await axios.post<ServerResponse>("/api/comments", {
        text,
        postId,
        parentId,
      });
      const response = postComment.data;

      showToast({
        variants: response.success ? "success" : "error",
        message: response.message,
      });

      if (response.success) {
        setText("");
        mutate("/api/comments");
      }
    } catch (error) {
      console.log("error creating comments: ", error);

      showToast({
        variants: "error",
        message:
          error instanceof AxiosError
            ? (error.response?.statusText as string)
            : "Error creating comment",
      });
    } finally {
      setLoading(false);
    }
  }

  const { avatar, username } = currentUser;
  return (
    <form className="mb-8" onSubmit={submitCondition}>
      <div className="mb-6 flex gap-4">
        <Img
          className="size-7.5 rounded-full object-cover"
          src={avatar}
          alt={`${username} - avatar`}
        />
        <div className="flex-1">
          <div className="border-light-gray has-focus:ring-accent flex-1 overflow-hidden rounded-[10px] border ring ring-transparent">
            <TextAreaAutoRezise
              minRows={4}
              rows={4}
              maxRows={7}
              placeholder="Add a comment..."
              className="text-secondary mb-2 w-full resize-none border border-none p-3 outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-5 py-3">
            <button
              className="bg-primary flex items-center gap-2 rounded-[10px] p-2 px-3 text-sm text-white disabled:opacity-50"
              disabled={isDisabled}
            >
              <span>
                {loading ? (
                  <Spinner size="small" />
                ) : (
                  <Send className="size-4 text-white" />
                )}
              </span>
              Post
            </button>
            <p className={cx("text-sm", textColor)}>
              {maxLength - text.length}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
