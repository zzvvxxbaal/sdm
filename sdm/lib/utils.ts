import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * Use this for all className merging.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Firestore timestamp to a Date object.
 * Handles both Firestore Timestamp objects and standard Date objects.
 */
export function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as Record<string, () => Date>).toDate();
  }
  return new Date();
}

/**
 * Formats a date string to a localized date.
 */
export function formatDate(date: string | Date | number): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Formats a date string to a localized date with time.
 */
export function formatDateTime(date: string | Date | number): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Truncates a string to a given length.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Delays execution for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a debounced function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Creates a throttled function.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generates a random string.
 */
export function generateId(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Safely accesses a nested object property.
 */
export function getNestedValue<T>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue: T
): T {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    value = (value as Record<string, unknown>)[key];
  }
  return value as T ?? defaultValue;
}
