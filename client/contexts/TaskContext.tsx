"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { taskApi } from "../lib/api/task.api";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TasksResponse,
  TaskStats,
  TaskStatus,
} from "../lib/types";
import { getNextStatus } from "@/lib/utils/helper";
import { useToast } from "@/hooks/useToast";
import { SUCCESS_MESSAGES, DEFAULT_PAGINATION } from "@/lib/utils/constants";

interface TaskContextType {
  tasks: Task[];
  pagination: TasksResponse["pagination"] | null;
  stats: TaskStats | null;
  isLoading: boolean;
  filters: TaskFilters;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  onTaskChange?: (callback: () => void) => () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Helper function to remove undefined values
const normalizeFilters = (filters: TaskFilters): TaskFilters => {
  const normalized: any = {};
  Object.keys(filters).forEach((key) => {
    const value = (filters as any)[key];
    if (value !== undefined) {
      normalized[key] = value;
    }
  });
  return normalized as TaskFilters;
};

// Helper function to compare filters
const areFiltersEqual = (a: TaskFilters, b: TaskFilters): boolean => {
  const normalizedA = normalizeFilters(a);
  const normalizedB = normalizeFilters(b);
  return JSON.stringify(normalizedA) === JSON.stringify(normalizedB);
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<
    TasksResponse["pagination"] | null
  >(null);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_PAGINATION);
  const [taskChangeCallbacks, setTaskChangeCallbacks] = useState<
    (() => void)[]
  >([]);

  const { success, error } = useToast();

  // Track the last filters used for fetching to prevent duplicate calls
  const lastFetchedFiltersRef = useRef<TaskFilters | null>(null);
  const isFetchingRef = useRef(false);

  // Function to register callbacks
  const registerTaskChangeCallback = useCallback((callback: () => void) => {
    setTaskChangeCallbacks((prev) => [...prev, callback]);

    // Return unregister function
    return () => {
      setTaskChangeCallbacks((prev) => prev.filter((cb) => cb !== callback));
    };
  }, []);

  // Function to notify all callbacks
  const notifyTaskChange = useCallback(() => {
    taskChangeCallbacks.forEach((callback) => callback());
  }, [taskChangeCallbacks]);

  // Wrapper for setFilters that normalizes the input
  const setFilters = useCallback((newFilters: TaskFilters) => {
    setFiltersState(normalizeFilters(newFilters));
  }, []);

  const fetchTasks = useCallback(
    async (newFilters?: TaskFilters) => {
      const appliedFilters = normalizeFilters(newFilters || filters);

      // Check if we've already fetched with these exact filters
      if (
        lastFetchedFiltersRef.current &&
        areFiltersEqual(appliedFilters, lastFetchedFiltersRef.current) &&
        isFetchingRef.current
      ) {
        return;
      }

      // Prevent duplicate simultaneous fetches
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        lastFetchedFiltersRef.current = appliedFilters;
        setIsLoading(true);

        const response = await taskApi.getTasks(appliedFilters);
        setTasks(response.tasks);
        setPagination(response.pagination);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch tasks";
        error(errorMessage);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [filters, error]
  );

  const fetchTaskStats = useCallback(async () => {
    try {
      const statsData = await taskApi.getTaskStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("Failed to fetch task stats:", err);
    }
  }, []);

  // Auto-fetch when filters change
  useEffect(() => {
    const normalizedFilters = normalizeFilters(filters);

    // Only fetch if filters changed
    if (
      !lastFetchedFiltersRef.current ||
      !areFiltersEqual(normalizedFilters, lastFetchedFiltersRef.current)
    ) {
      fetchTasks(normalizedFilters);
    }
  }, [filters, fetchTasks]);

  const createTask = async (data: CreateTaskData) => {
    try {
      setIsLoading(true);
      const newTask = await taskApi.createTask(data);

      // Optimistically add the new task to the list
      setTasks((prevTasks) => [newTask, ...prevTasks]);

      // Update stats optimistically
      if (stats) {
        const statUpdates: Partial<TaskStats> = {
          total: (stats.total || 0) + 1,
        };

        if (newTask.status === TaskStatus.PENDING) {
          statUpdates.pending = (stats.pending || 0) + 1;
        } else if (newTask.status === TaskStatus.IN_PROGRESS) {
          statUpdates.inProgress = (stats.inProgress || 0) + 1;
        } else if (newTask.status === TaskStatus.COMPLETED) {
          statUpdates.completed = (stats.completed || 0) + 1;
        }

        setStats({ ...stats, ...statUpdates });
      }

      // Update pagination
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total + 1,
        });
      }

      success(SUCCESS_MESSAGES.TASK_CREATED);
      notifyTaskChange(); // Notify listeners
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create task";
      error(errorMessage);
      // Refetch on error to ensure consistency
      await fetchTasks(filters);
      await fetchTaskStats();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: number, data: UpdateTaskData) => {
    // Store original task for rollback
    const originalTask = tasks.find((task) => task.id === id);
    if (!originalTask) return;

    try {
      setIsLoading(true);
      const updatedTask = await taskApi.updateTask(id, data);

      // Optimistically update the task in the list
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );

      // Update stats if status changed
      if (stats && data.status && data.status !== originalTask.status) {
        const statUpdates: Partial<TaskStats> = {};

        // Decrease from old status
        if (originalTask.status === TaskStatus.PENDING) {
          statUpdates.pending = (stats.pending || 0) - 1;
        } else if (originalTask.status === TaskStatus.IN_PROGRESS) {
          statUpdates.inProgress = (stats.inProgress || 0) - 1;
        } else if (originalTask.status === TaskStatus.COMPLETED) {
          statUpdates.completed = (stats.completed || 0) - 1;
        }

        // Increase for new status
        if (data.status === TaskStatus.PENDING) {
          statUpdates.pending = (statUpdates.pending ?? stats.pending ?? 0) + 1;
        } else if (data.status === TaskStatus.IN_PROGRESS) {
          statUpdates.inProgress =
            (statUpdates.inProgress ?? stats.inProgress ?? 0) + 1;
        } else if (data.status === TaskStatus.COMPLETED) {
          statUpdates.completed =
            (statUpdates.completed ?? stats.completed ?? 0) + 1;
        }

        setStats({ ...stats, ...statUpdates });
      }

      success(SUCCESS_MESSAGES.TASK_UPDATED);
      notifyTaskChange(); // Notify listeners
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update task";
      error(errorMessage);

      // Rollback on error
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? originalTask : task))
      );
      await fetchTaskStats();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    // Store original task and index for rollback
    const originalTask = tasks.find((task) => task.id === id);
    if (!originalTask) return;

    const originalIndex = tasks.findIndex((task) => task.id === id);

    try {
      setIsLoading(true);

      // Optimistically remove the task
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      // Update stats optimistically
      if (stats) {
        const statUpdates: Partial<TaskStats> = {
          total: (stats.total || 0) - 1,
        };

        if (originalTask.status === TaskStatus.PENDING) {
          statUpdates.pending = (stats.pending || 0) - 1;
        } else if (originalTask.status === TaskStatus.IN_PROGRESS) {
          statUpdates.inProgress = (stats.inProgress || 0) - 1;
        } else if (originalTask.status === TaskStatus.COMPLETED) {
          statUpdates.completed = (stats.completed || 0) - 1;
        }

        setStats({ ...stats, ...statUpdates });
      }

      // Update pagination
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
        });
      }

      await taskApi.deleteTask(id);
      success(SUCCESS_MESSAGES.TASK_DELETED);
      notifyTaskChange(); // Notify listeners
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete task";
      error(errorMessage);

      // Rollback on error - restore the task at its original position
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        newTasks.splice(originalIndex, 0, originalTask);
        return newTasks;
      });
      await fetchTaskStats();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (id: number) => {
    // Store the original task for rollback in case of error
    const originalTask = tasks.find((task) => task.id === id);
    if (!originalTask) return;

    const newStatus = getNextStatus(originalTask.status);

    // Optimistic update with updatedAt
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );

    // Update stats optimistically
    if (stats) {
      const statUpdates: Partial<TaskStats> = {};

      // Decrease from old status
      if (originalTask.status === TaskStatus.PENDING) {
        statUpdates.pending = (stats.pending || 0) - 1;
      } else if (originalTask.status === TaskStatus.IN_PROGRESS) {
        statUpdates.inProgress = (stats.inProgress || 0) - 1;
      } else if (originalTask.status === TaskStatus.COMPLETED) {
        statUpdates.completed = (stats.completed || 0) - 1;
      }

      // Increase for new status
      if (newStatus === TaskStatus.PENDING) {
        statUpdates.pending = (statUpdates.pending ?? stats.pending ?? 0) + 1;
      } else if (newStatus === TaskStatus.IN_PROGRESS) {
        statUpdates.inProgress =
          (statUpdates.inProgress ?? stats.inProgress ?? 0) + 1;
      } else if (newStatus === TaskStatus.COMPLETED) {
        statUpdates.completed =
          (statUpdates.completed ?? stats.completed ?? 0) + 1;
      }

      setStats({ ...stats, ...statUpdates });
    }

    try {
      // Make the API call
      const updatedTask = await taskApi.toggleTaskStatus(id);

      // Update with real data from server
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );

      success(SUCCESS_MESSAGES.TASK_STATUS_UPDATED);
      notifyTaskChange(); // Notify listeners
    } catch (err: any) {
      // Rollback on error
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? originalTask : task))
      );

      // Rollback stats
      if (stats) {
        setStats(stats);
      }

      const errorMessage =
        err.response?.data?.message || "Failed to toggle task status";
      error(errorMessage);

      // Optionally refetch to ensure consistency
      await fetchTaskStats();
      throw err;
    }
  };

  const value: TaskContextType = {
    tasks,
    pagination,
    stats,
    isLoading,
    filters,
    fetchTasks,
    fetchTaskStats,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
    onTaskChange: registerTaskChangeCallback,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
