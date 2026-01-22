import { TaskStatus } from "@prisma/client";

const transitions: Record<TaskStatus, TaskStatus[]> = {
  PENDING: ["IN_PROGRESS", "COMPLETED"],
  IN_PROGRESS: ["PENDING", "COMPLETED"],
  COMPLETED: [],
};

export const canTransition = (
  from: TaskStatus,
  to: TaskStatus
): boolean => {
  return transitions[from].includes(to);
};
