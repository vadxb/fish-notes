/**
 * Date formatting utilities for consistent date/time display across the application
 */

/**
 * Format a date string or Date object to a consistent date format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a date string or Date object to include time
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 15, 2024, 2:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a date string or Date object to time only
 * @param date - Date string or Date object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a date string or Date object for use in auto-generated event titles
 * @param date - Date string or Date object (defaults to current date)
 * @returns Formatted date string for titles (e.g., "Jan 15, 2024")
 */
export const formatDateForTitle = (
  date: string | Date = new Date()
): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculate duration between two dates
 * @param start - Start date string or Date object
 * @param end - End date string or Date object
 * @returns Formatted duration string (e.g., "2h 30m" or "45m")
 */
export const formatDuration = (
  start: string | Date,
  end: string | Date
): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  }
  return `${diffMinutes}m`;
};

/**
 * Get current date and time in ISO format for form inputs
 * @returns Object with date and time strings for HTML inputs
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  const time = now.toTimeString().slice(0, 5); // HH:MM format
  return { date, time };
};
