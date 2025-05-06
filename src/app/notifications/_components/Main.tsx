"use client";

import NotificationEmptyState from "@/components/empty-states/NotificationEmptyState";
import axios from "axios";
import { useEffect, useRef } from "react";

import NotificationLoader from "@/components/loaders/NotificationLoader";
import NotificationCard from "./NotificationCard";
import NotificationsError from "./notification-error";
import { eventEmitter } from "@/lib/eventEmitter";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import useSWRInfinite from "swr/infinite";
import BottomPostLoader from "@/components/loaders/bottom-post-loader";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ApiResponse = {
  success: boolean;
  notifications: INotification[];
  username: string;
};

export default function NotificationsPage() {
  const { data, error, mutate, isValidating, setSize, size } =
    useSWRInfinite<ApiResponse>(
      (pageIndex) => `/api/notifications?page=${pageIndex + 1}&limit=5`,
      fetcher,
    );
  const ref = useRef<HTMLDivElement | null>(null);

  const notifications = data ? data.flatMap((not) => not.notifications) : [];

  useIntersectionObserver({
    ref: ref,
    isValidating,
    onIntersect: () => {
      if (!isValidating && data?.[size - 1].notifications.length) {
        setSize(size + 1);
      }
    },
  });

  useEffect(() => {
    const notificationListener = () => {
      mutate();
    };

    eventEmitter.on("notification", notificationListener);

    return () => {
      eventEmitter.off("notification", notificationListener);
    };
  }, [mutate]);

  if (error) {
    return <NotificationsError />;
  }

  if (!data && size === 1) {
    return <NotificationLoader />;
  }

  const { username } = data![0];

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
      <BottomPostLoader ref={ref} isValidating={isValidating} />
    </div>
  );
}
