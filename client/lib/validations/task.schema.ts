import * as Yup from "yup";
import { TaskStatus } from "../types";

export const createTaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .required("Title is required"),
  description: Yup.string().max(1000, "Description is too long").optional(),
  status: Yup.string()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});

export const updateTaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .optional(),
  description: Yup.string()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),
  status: Yup.string()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});
