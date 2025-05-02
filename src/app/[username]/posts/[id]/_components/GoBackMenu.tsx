"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";

export default function GoBackWithMenu({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-between py-2">
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

     {children}
    </div>
  );
}
