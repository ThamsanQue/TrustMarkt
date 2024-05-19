import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const countdownTimer = async (
  seconds: number,
  setCountdown: React.Dispatch<React.SetStateAction<number>>,
) => {
  for (let i = seconds; i > 0; i--) {
    setCountdown(i);
    await delay(1000);
  }
  setCountdown(0);
};
