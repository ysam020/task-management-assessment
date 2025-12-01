import { prisma } from "../config/index";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
} from "../utils/validations";
import { Task, TaskStatus, Prisma } from "@prisma/client";

interface PaginatedTasks {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class TaskService {
  async createTask(userId: number, data: CreateTaskInput): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || TaskStatus.PENDING,
        userId,
      },
    });

    return task;
  }

  async getTasks(
    userId: number,
    query: TaskQueryInput
  ): Promise<PaginatedTasks> {
    const { page, limit, status, search, sortBy, sortOrder } = query;

    // Build where clause
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Get total count
    const total = await prisma.task.count({ where });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Fetch tasks
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getTaskById(userId: number, taskId: number): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.userId !== userId) {
      throw new ForbiddenError("Access denied to this task");
    }

    return task;
  }

  async updateTask(
    userId: number,
    taskId: number,
    data: UpdateTaskInput
  ): Promise<Task> {
    await this.getTaskById(userId, taskId);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    return task;
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    await this.getTaskById(userId, taskId);

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  async toggleTaskStatus(userId: number, taskId: number): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);

    // Toggle logic: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
    let newStatus: TaskStatus;
    switch (task.status) {
      case TaskStatus.PENDING:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.COMPLETED;
        break;
      case TaskStatus.COMPLETED:
        newStatus = TaskStatus.PENDING;
        break;
      default:
        newStatus = TaskStatus.PENDING;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    return updatedTask;
  }

  async getTaskStats(userId: number): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  }> {
    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: TaskStatus.PENDING } }),
      prisma.task.count({ where: { userId, status: TaskStatus.IN_PROGRESS } }),
      prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
    };
  }

  async getRecentActivity(userId: number, limit: number = 5) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return tasks;
  }
}

export default new TaskService();
