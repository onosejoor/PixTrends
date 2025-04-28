"use client";

import NotificationEmptyState from "@/components/empty-states/NotificationEmptyState";
import axios from "axios";
import { useEffect, useState } from "react";

import useSWR from "swr";
import NotificationLoader from "@/components/loaders/NotificationLoader";
import NotificationCard from "./NotificationCard";
import NotificationsError from "./notification-error";
import { eventEmitter } from "@/lib/eventEmitter";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  notifications: INotification[];
  username: string;
};

export default function NotificationsPage() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
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
    const notificationListener = () => {
      mutate();
    };

    eventEmitter.on("notification", notificationListener);

    return () => {
      eventEmitter.off("notification", notificationListener);
    };
  }, [data, mutate]);

  if (error) {
    return <NotificationsError />;
  }

  if (isLoading) {
    return <NotificationLoader />;
  }

  const { username } = data!;

  return (
    <div className="bg-foreground py-5 sm:px-5">
      <ul className="divide-accent/70 divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li className="py-5" key={index}>
              <NotificationCard
                notification={notification}
                username={username}
              />
            </li>
          ))
        ) : (
          <NotificationEmptyState />
        )}
      </ul>
    </div>
  );
}
