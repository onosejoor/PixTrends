"use client";

import NotificationEmptyState from "@/components/empty-states/NotificationEmptyState";
import Img from "@/components/Img";
import axios from "axios";
import { LucideHeart, MessageCircleMore, ReplyAll } from "lucide-react";
import { MdPersonAdd } from "react-icons/md";
import { useEffect, useState } from "react";

import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  notifications: INotification[];
};

export default function NotificationsPage() {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    "/api/notifications",
    fetcher,
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications);
    }
  }, [data]);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotification: INotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    eventSource.onerror = () => {
      console.error("Error with SSE connection.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (error) {
    return <p>error...</p>;
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div className="bg-foreground">
      <ul className="divide-accent divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationCard notification={notification} key={index} />
          ))
        ) : (
          <NotificationEmptyState />
        )}
      </ul>
    </div>
  );
}

const NotificationCard = ({
  notification,
}: {
  notification: INotification;
}) => {
  const { sender, type } = notification;
  return (
    <li className="flex gap-5 p-5">
      {getType(type)}
      <div className="grid gap-5">
        <Img
          src={sender.avatar}
          alt={sender.name}
          className="shadow-avatar size-10 rounded-full object-cover"
        />

        {getMessage(type, sender)}
      </div>
    </li>
  );
};

function getType(type: INotification["type"]) {
  switch (type) {
    case "like":
      return <LucideHeart className="fill-blue-500 size-7.5" stroke="none" />;
    case "follow":
      return <MdPersonAdd className="fill-blue-500 size-7.5" stroke="none" />;

    case "reply":
      return <ReplyAll className="fill-blue-500 size-7.5" stroke="none" />;

    case "comment":
      return <MessageCircleMore className="fill-blue-500 size-7.5" stroke="none" />;

    default:
      return <LucideHeart className="fill-blue-500 size-7.5" stroke="none" />;
  }
}

function getMessage(
  type: INotification["type"],
  user: INotification["reciever"],
) {
  const className = "text-secondary text-lg font-medium";
  switch (type) {
    case "like":
      return <p className={className}>{user.username} liked your post!</p>;
    case "follow":
      return <p className={className}>{user.username} followed You!</p>;

    case "reply":
      return (
        <p className={className}>{user.username} replied to your comment!</p>
      );

    case "comment":
      return (
        <p className={className}>{user.username} commented on your post!</p>
      );

    default:
      return <p className={className}>{user.username} iked your post!</p>;
  }
}
