import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...cs: ClassValue[]) {
  return twMerge(clsx(...cs));
}

export function validateUsername(username: string) {
  const regex = /^(?![_-])(?!.*[_-]{2})[a-zA-Z0-9_-]{3,16}(?<![_-])$/;
  return regex.test(username);
}
