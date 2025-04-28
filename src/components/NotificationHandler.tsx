"use client";

import { checkSSE } from "@/lib/actions/sse";
import { eventEmitter } from "@/lib/eventEmitter";
import { useEffect } from "react";
import { mutate } from "swr";

export const showNotification = () => {
  eventEmitter.emit("notification", { message: "New notification received!" });
};

export default function NotificationHandler() {
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToSSE = async (attempt = 0) => {
      try {
        const { success, url, code } = await checkSSE();

        if (!success || !url) {
          console.log(`Failed to connect to SSE. Status: ${code}`);
          return;
        }
        eventSource = new EventSource(url);

        console.log("connected");

        eventSource.onmessage = () => {
          const isOnNotificationsPage =
            window.location.pathname === "/notifications";

          if (isOnNotificationsPage) {
            mutate("/api/notifications");
          } else {
            showNotification();
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE connection error:", error);
          eventSource?.close();

          if (attempt < 3) {
            console.log(
              `Retrying SSE connection in 5 seconds... Attempt ${attempt + 1}`,
            );
            setTimeout(() => connectToSSE(attempt + 1), 5000);
          } else {
            console.log("Max retries reached. Giving up on SSE connection.");
          }
        };
      } catch (err) {
        console.error("Unexpected error while connecting to SSE:", err);

        if (attempt < 3) {
          console.log(
            `Retrying SSE connection in 5 seconds... Attempt ${attempt + 1}`,
          );
          setTimeout(() => connectToSSE(attempt + 1), 5000);
        } else {
          console.log("Max retries reached. Giving up on SSE connection.");
        }
      }
    };

    connectToSSE();

    return () => {
      eventSource?.close();
    };
  }, []);

  return null;
}
