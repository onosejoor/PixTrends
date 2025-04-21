import { Bell } from "lucide-react";

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <Bell className="text-gray h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No Notification yet</h3>
      <p className="text-gray max-w-md">Your Notifications will appear here.</p>
    </div>
  );
}
