import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toastErrorPayload(message: string, title?: string) {
  return {
    title: title ?? "Uh oh! Something went wrong.",
    description: message,
    variant: "destructive" as "destructive",
  };
}
export function sleep(second: number = 1) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, 1000 * second)
  );
}
