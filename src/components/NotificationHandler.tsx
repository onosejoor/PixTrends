"use client";

import { eventEmitter } from "@/lib/eventEmitter";
import { useEffect } from "react";
import { mutate } from "swr";

export const showNotification = () => {
  eventEmitter.emit("notification", { message: "New notification received!" });
};

export default function NotificationHandler() {
  useEffect(() => {
    const connectToSSE = () => {
      const eventSource = new EventSource(`/api/notifications/stream`);

      eventSource.onmessage = () => {
        const isOnNotificationsPage =
          window.location.pathname === "/notifications";

        if (isOnNotificationsPage) {
          mutate("/api/notifications");
        }

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
