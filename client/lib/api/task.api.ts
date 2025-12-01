import axiosInstance from "./axios";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TasksResponse,
  TaskStats,
  ApiResponse,
} from "../types";
import { API_ENDPOINTS } from "../utils/constants";

export const taskApi = {
  // Get all tasks with filters
  getTasks: async (filters?: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await axiosInstance.get<ApiResponse<TasksResponse>>(
      `${API_ENDPOINTS.TASKS.BASE}?${params.toString()}`
    );
    return response.data.data!;
  },

  // Get single task by ID
  getTaskById: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<ApiResponse<{ task: Task }>>(
      `${API_ENDPOINTS.TASKS.BY_ID(id)}`
    );
    return response.data.data!.task;
  },

  // Create new task
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await axiosInstance.post<ApiResponse<{ task: Task }>>(
      `${API_ENDPOINTS.TASKS.BASE}`,
      data
    );
    return response.data.data!.task;
  },

  // Update task
  updateTask: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await axiosInstance.patch<ApiResponse<{ task: Task }>>(
      `${API_ENDPOINTS.TASKS.BY_ID(id)}`,
      data
    );
    return response.data.data!.task;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.TASKS.BY_ID(id)}`);
  },

  // Toggle task status
  toggleTaskStatus: async (id: number): Promise<Task> => {
    const response = await axiosInstance.post<ApiResponse<{ task: Task }>>(
      `${API_ENDPOINTS.TASKS.TOGGLE_STATUS(id)}`
    );
    return response.data.data!.task;
  },

  // Get task statistics
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await axiosInstance.get<ApiResponse<{ stats: TaskStats }>>(
      `${API_ENDPOINTS.TASKS.STATS}`
    );
    return response.data.data!.stats;
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 5): Promise<Task[]> => {
    const response = await axiosInstance.get<ApiResponse<{ tasks: Task[] }>>(
      `${API_ENDPOINTS.TASKS.RECENT_ACTIVITY}?limit=${limit}`
    );
    return response.data.data!.tasks;
  },
};
