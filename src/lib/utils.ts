import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRegId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 8; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REG-${randomPart}`;
}

export function extractId(raw: string): string {
  const trimmed = raw.trim();
  const upper = trimmed.toUpperCase();
  if (upper.startsWith("REG-")) {
      return upper.substring(0, 14);
  }
  const regMatch = upper.match(/REG-[A-Z0-9]{4,10}/i);
  if (regMatch) {
      return regMatch[0].toUpperCase();
  }
  return upper;
}
