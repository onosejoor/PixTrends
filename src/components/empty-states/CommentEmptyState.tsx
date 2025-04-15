import { MessageSquare } from "lucide-react";

export default function CommentEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <MessageSquare className="text-gray h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No comments yet</h3>
      <p className="text-gray max-w-md">
        Be the first to share your thoughts on this post. Your insights and
        questions are welcome!
      </p>
    </div>
  );
}
