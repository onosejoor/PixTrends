"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { MdArrowBack } from "react-icons/md";

export default function GoBackWithMenu() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2">
      {showModal && (
        <div
          className="fixed inset-0 z-1 flex items-center justify-center bg-transparent"
          onClick={() => setShowModal(false)}
        />
      )}
      <button
        onClick={() => router.back()}
        className="bg-primary flex items-center gap-2 rounded-sm px-5 py-2 text-white"
      >
        <MdArrowBack /> Back
      </button>

      <div className="relative">
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <EllipsisVertical className="text-primary h-5 w-5" />
        </button>

        {showModal && (
          <div
            className="animate-in zoom-in-0 absolute right-full z-10 w-50 rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-3">
              <li className="w-full">
                <button className="text-gray hover:text-primary hover:bg-foreground w-full rounded-md p-3 text-left text-base">
                  Copy Profile Link
                </button>
              </li>
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full px-3 text-left text-base text-blue-500 hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
