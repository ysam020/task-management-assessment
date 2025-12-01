import { Router } from "express";
import taskController from "../controllers/task.controller";
import { validate, validateQuery } from "../middlewares/validations.middleware";
import { authenticate } from "../middlewares/authentication.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../utils/validations";

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get("/", validateQuery(taskQuerySchema), taskController.getTasks);
router.post("/", validate(createTaskSchema), taskController.createTask);
router.get("/stats", taskController.getTaskStats);
router.get("/recent", taskController.getRecentActivity);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", validate(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.post("/:id/toggle", taskController.toggleTaskStatus);

export default router;
