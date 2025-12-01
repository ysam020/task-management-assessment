import { TaskStatus } from "../types";
import { TASK_STATUS_CONFIG } from "./constants";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  return TASK_STATUS_CONFIG[status]?.color ?? "#6b7280";
};

export const getStatusLabel = (status: TaskStatus): string => {
  return TASK_STATUS_CONFIG[status]?.label ?? status;
};

export const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  switch (currentStatus) {
    case TaskStatus.PENDING:
      return TaskStatus.IN_PROGRESS;
    case TaskStatus.IN_PROGRESS:
      return TaskStatus.COMPLETED;
    case TaskStatus.COMPLETED:
      return TaskStatus.PENDING;
    default:
      return TaskStatus.PENDING;
  }
};
