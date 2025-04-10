import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...cs: ClassValue[]) {
  return twMerge(clsx(...cs));
}
