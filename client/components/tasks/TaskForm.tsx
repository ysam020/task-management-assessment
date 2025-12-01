"use client";

import { Formik, Form, Field } from "formik";
import { MenuItem, Box, Stack } from "@mui/material";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Task, TaskStatus } from "@/lib/types";
import { useTasks } from "@/contexts/TaskContext";
import { useToast } from "@/hooks/useToast";
import { TASK_STATUS_OPTIONS, SUCCESS_MESSAGES } from "@/lib/utils/constants";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/lib/validations/task.schema";

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const { success, error } = useToast();
  const isEditing = !!task;

  const initialValues = {
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || TaskStatus.PENDING,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isEditing ? updateTaskSchema : createTaskSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (isEditing) {
            await updateTask(task.id, values);
            success(SUCCESS_MESSAGES.TASK_UPDATED);
          } else {
            await createTask(values);
            success(SUCCESS_MESSAGES.TASK_CREATED);
          }
          onSuccess();
        } catch (err) {
          error(isEditing ? "Failed to update task" : "Failed to create task");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Field name="title">
              {({ field }: any) => (
                <Input
                  {...field}
                  fullWidth
                  label="Title"
                  placeholder="Enter task title"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  disabled={isSubmitting}
                />
              )}
            </Field>

            <Field name="description">
              {({ field }: any) => (
                <Input
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  placeholder="Enter task description (optional)"
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  disabled={isSubmitting}
                />
              )}
            </Field>

            <Field name="status">
              {({ field }: any) => (
                <Input
                  {...field}
                  select
                  fullWidth
                  label="Status"
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                  disabled={isSubmitting}
                >
                  {TASK_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Input>
              )}
            </Field>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                justifyContent: "flex-end",
                pt: 1,
              }}
            >
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                variant="outlined"
                size="medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                loading={isSubmitting}
              >
                {isEditing ? "Update Task" : "Create Task"}
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
