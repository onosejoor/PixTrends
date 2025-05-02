"use client";

import { useState } from "react";
import { Settings, LogOut, AlignLeft } from "lucide-react";
import Link from "next/link";

export function UserModal() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="xsm:absolute xsm:bottom-5 relative">
      {openModal && (
        <div
          onClick={() => setOpenModal(false)}
          className="animate-in fade-in-0 zoom-in-95 fixed inset-0 z-20 flex items-start justify-center"
        ></div>
      )}
      <button onClick={() => setOpenModal(!openModal)}>
        <AlignLeft className="text-primary size-7.5" />
      </button>
      {openModal && (
        <div className="border-light-gray animate-in zoom-in-95 xsm:-right-25 xsm:bottom-full xsm:top-auto xsm:left-0 absolute top-full right-full bottom-0 z-30 h-fit w-fit max-w-50 overflow-hidden rounded-xl border bg-white p-2 shadow-xl md:-right-10 md:bottom-10">
          <div className="py-2">
            <button
              className={
                "hover:bg-foreground w-full rounded-md px-5 py-3 text-left text-red-500"
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-gray">
                  <LogOut className="text-red-500" size={18} />
                </span>
                <span className={"font-medium"}>Logout</span>
              </div>
            </button>
            

            <Link
              href={"/settings"}
              className={
                "hover:bg-foreground w-full block rounded-md px-5 py-3 h-fit text-left"
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-gray">
                  <Settings size={18} />
                </span>
                <span className={"text-gray font-medium"}>Settings</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
