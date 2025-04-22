"use client";

import { showToast } from "@/hooks/useToast";
import { useEffect } from "react";
import { mutate } from "swr";

import { EventEmitter } from "events";

export const eventEmitter = new EventEmitter();

export const showNotification = () => {
  eventEmitter.emit("notification", { message: "New notification received!" });
};

export default function NotificationHandler() {
  useEffect(() => {
    const connectToSSE = () => {
      const eventSource = new EventSource(`/api/notifications/stream`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const isOnNotificationsPage =
          window.location.pathname === "/notifications";

        if (isOnNotificationsPage) {
          mutate("/api/notifications");
        }

        showToast({
          message: data.message || "New notification received!",
          variants: "success",
        });

        showNotification(); 
      };

      eventSource.onerror = () => {
        console.log("Error with SSE connection. Retrying in 5 seconds...");
        eventSource.close();
        setTimeout(connectToSSE, 5000);
      };

      return eventSource;
    };

    const eventSource = connectToSSE();

    return () => {
      eventSource.close();
    };
  }, []);

  return null;
}
