"use client";

import { useState } from "react";
import { cx } from "@/components/utils";
import { Settings, LogOut, AlignLeft } from "lucide-react";

export function UserModal() {
  const [openModal, setOpenModal] = useState(false);

  const navItems = [
    { label: "Settings", icon: <Settings size={18} /> },
    {
      label: "Log out",
      icon: <LogOut className="text-red-500" size={18} />,
      isDanger: true,
    },
  ];

  return (
    <div className="relative xsm:absolute xsm:bottom-5">
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
        <div className="border-light-gray animate-in zoom-in-95 xsm:-right-25 xsm:bottom-full xsm:top-auto absolute top-full right-full bottom-0 z-30 h-fit w-fit max-w-50 overflow-hidden rounded-xl border bg-white p-2 shadow-xl xsm:left-0 md:-right-10 md:bottom-10">
          <div className="py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={cx(
                  "hover:bg-foreground w-full rounded-md px-5 py-3 text-left",
                  item.isDanger ? "text-red-500" : "text-primary",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray">{item.icon}</span>
                  <span className={"font-medium"}>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
