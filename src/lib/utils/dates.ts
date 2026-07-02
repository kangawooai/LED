import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

export function formatDate(
  date: string | Date,
  formatString: string = "PPP"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "PPP p");
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "p")}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "p")}`;
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}
