import { Response, NextFunction } from "express";
import taskService from "../services/task.service";
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
} from "../utils/validations";
import { AuthRequest } from "../middlewares/authentication.middleware";

export class TaskController {
  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data: CreateTaskInput = req.body;
      const task = await taskService.createTask(userId, data);

      res.status(201).json({
        status: "success",
        message: "Task created successfully",
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const query: TaskQueryInput = req.query as any;
      const result = await taskService.getTasks(userId, query);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = parseInt(req.params.id, 10);

      if (Number.isNaN(taskId)) {
        res.status(400).json({
          status: "fail",
          message: "Invalid task id",
        });
        return;
      }

      const task = await taskService.getTaskById(userId, taskId);

      res.status(200).json({
        status: "success",
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = parseInt(req.params.id, 10); // 🔹

      if (Number.isNaN(taskId)) {
        res.status(400).json({
          status: "fail",
          message: "Invalid task id",
        });
        return;
      }

      const data: UpdateTaskInput = req.body;

      const task = await taskService.updateTask(userId, taskId, data);

      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = parseInt(req.params.id, 10); // 🔹

      if (Number.isNaN(taskId)) {
        res.status(400).json({
          status: "fail",
          message: "Invalid task id",
        });
        return;
      }

      await taskService.deleteTask(userId, taskId);

      res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleTaskStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = parseInt(req.params.id, 10); // 🔹

      if (Number.isNaN(taskId)) {
        res.status(400).json({
          status: "fail",
          message: "Invalid task id",
        });
        return;
      }

      const task = await taskService.toggleTaskStatus(userId, taskId);

      res.status(200).json({
        status: "success",
        message: "Task status toggled successfully",
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const stats = await taskService.getTaskStats(userId);

      res.status(200).json({
        status: "success",
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 5;

      const tasks = await taskService.getRecentActivity(userId, limit);

      res.status(200).json({
        status: "success",
        data: { tasks },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
