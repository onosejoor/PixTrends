'use client'

import { CancelIcon, CheckedIcon, ErrorIcon } from "@/components/Icons";
import { cx } from "@/components/utils";
import EventEmitter from "events";
import { useCallback, useEffect, useRef, useState } from "react";

type ToastProps = {
  message: string;
  variants: ToastVariants;
};
type ToastVariants = "success" | "error";

type ToastType = {
  info?: ToastProps;
  visible: boolean;
};

const toastEmitter = new EventEmitter();

const showToast = (props: ToastProps) => {
  toastEmitter.emit("showToast", props);
};

const onShowToast = (callback: (props: ToastProps) => void) => {
  toastEmitter.on("showToast", callback);
};

const Toast: React.FC = () => {
  const [toast, setToast] = useState<ToastType>({
    info: undefined,
    visible: false,
  });

  const { message, variants } = toast.info || {};
  const duration = 5000;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleShowToast = useCallback(
    (data: ToastProps) => {
      setToast({ info: data, visible: true });
      clearTimer();
      timerRef.current = setTimeout(() => {
        setToast({ info: undefined, visible: false });
      }, duration);
    },
    [clearTimer, duration],
  );

  useEffect(() => {
    onShowToast(handleShowToast);
    return () => {
      toastEmitter.removeListener("showToast", handleShowToast);
      clearTimer();
    };
  }, [clearTimer, handleShowToast]);

  useEffect(() => {
    if (toast.visible) {
      timerRef.current = setTimeout(() => {
        setToast({ info: undefined, visible: false });
      }, duration);
    }
    return () => clearTimer();
  }, [toast.visible, clearTimer]);

  const removeToast = () => {
    setToast({ info: undefined, visible: false });
    clearTimeout(timerRef.current!);
  };

  const toastVariant = {
    success: "bg-white text-primary border-2 border-primary",
    error: "bg-red-500 text-foreground",
  };

  const userVariants = toastVariant[variants!];

  if (!toast.visible) {
    return null;
  }

  return (
    <div
      className={cx(
        userVariants,
        "group shadow-post-card shadow-light-gray animate-in slide-in-from-top fixed top-1.5 bottom-auto left-1/2 z-[100] flex -translate-x-1/2 translate-y-0 items-center justify-between gap-2 rounded-[12px] px-6 py-4 transition-transform sm:!w-fit sm:!max-w-[500px]",
      )}
    >
      <div>{variants === "success" ? <CheckedIcon /> : <ErrorIcon />}</div>
      <p className="font-medium">{message}</p>

      <button
        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-[1]"
        onClick={removeToast}
      >
        <CancelIcon fill={variants === "success" ? "red" : "white"} />
      </button>
    </div>
  );
};

export { Toast, showToast };
