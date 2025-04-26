import {
  LucideHeart,
  MessageCircleMore,
  ReplyAll,
  Trash2Icon,
} from "lucide-react";

import { MdPersonAdd } from "react-icons/md";
import Img from "@/components/Img";
import dayjs from "dayjs";
import { cx } from "@/components/utils";
import { getMessage, getRef } from "./CardComps";
import Link from "next/link";
import { useTransition } from "react";
import { deleteNotification } from "@/lib/actions/notification";
import { showToast } from "@/hooks/useToast";

type Props = {
  notification: INotification;
  username: string;
};

const NotificationCard = ({ notification, username }: Props) => {
  const [pending, startTransition] = useTransition();

  const { sender, type, _id, postId, commentId, isRead } = notification;

  const handleDelete = () => {
    startTransition(async () => {
      const { success, message } = await deleteNotification(_id.toString());

      showToast({
        variants: success ? "success" : "error",
        message,
      });

      return;
    });
  };

  const link = `/${username}/posts/${postId?._id}`;

  return (
    <div
      className={cx(
        "group relative flex items-start gap-4 rounded-md p-4",
        !isRead && "bg-white",
      )}
    >
      <div className="flex w-full gap-4">
        <div className="mt-1 shrink-0">{getType(type)}</div>

        <div className="grid w-full gap-3">
          <div className="flex items-start gap-3">
            <Link href={`/${sender.username}`}>
              <Img
                src={sender.avatar}
                alt={sender.name}
                className="shadow-avatar border-background size-11 rounded-full border-2 object-cover"
              />
            </Link>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                {getMessage(type, sender)}
                <button
                  disabled={pending}
                  className="hover:text-primary rounded-md disabled:opacity-70 bg-light-gray p-2"
                  onClick={handleDelete}
                >
                  <Trash2Icon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>

          {getRef(type, postId, link, commentId)}

          <div className="text-gray mt-1 text-xs">
            {dayjs(notification.createdAt).format(`DD-MM-YYYY, h:mm A`)}
          </div>
        </div>
      </div>
    </div>
  );
};

function getType(type: INotification["type"]) {
  const iconClass = "size-6";
  switch (type) {
    case "like":
      return <LucideHeart className={`${iconClass} text-accent`} />;
    case "follow":
      return <MdPersonAdd className={`${iconClass} text-accent`} />;
    case "reply":
      return <ReplyAll className={`${iconClass} text-accent`} />;
    case "comment":
      return <MessageCircleMore className={`${iconClass} text-accent`} />;
    default:
      return <LucideHeart className={`${iconClass} text-gray`} />;
  }
}

export default NotificationCard;
