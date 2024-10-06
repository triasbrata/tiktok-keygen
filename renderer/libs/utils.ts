import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toastErrorPayload(message: string, title?: string) {
  return {
    title: title ?? "woops...",
    description: message,
    variant: "destructive" as "destructive",
  };
}
