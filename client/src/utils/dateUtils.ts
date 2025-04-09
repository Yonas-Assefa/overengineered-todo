import { format, parseISO, addDays, isSameDay } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = addDays(today, 1);
    tomorrow.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    if (isSameDay(taskDate, today)) {
      return "Today";
    } else if (isSameDay(taskDate, tomorrow)) {
      return "Tomorrow";
    } else {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
