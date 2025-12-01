"use client";

import { useState } from "react";
import {
  Typography,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Schedule } from "@mui/icons-material";
import { Card } from "@/components/common/Card";
import { Task, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/helper";
import { getStatusLabel } from "@/lib/utils/helper";
import { TASK_STATUS_CONFIG } from "@/lib/utils/constants";
import { useTasks } from "@/contexts/TaskContext";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onClick, onEdit, onDelete }: TaskCardProps) {
  const { toggleTaskStatus } = useTasks();
  const [isToggling, setIsToggling] = useState(false);

  const config = TASK_STATUS_CONFIG[task.status];
  const StatusIcon = config.icon;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await toggleTaskStatus(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card
      onClick={onClick}
      hoverable
      hoverColor={config.color}
      compact
      noPadding
    >
      <Box sx={{ p: 1.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            mb: 0.75,
          }}
        >
          {/* 3-State Checkbox */}
          <Tooltip
            title={`Click to mark as ${getStatusLabel(task.status)}`}
            placement="top"
          >
            <Box
              onClick={handleToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: config.color,
                transition: "all 0.2s",
                flexShrink: 0,
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            >
              {isToggling ? (
                <CircularProgress size={20} sx={{ color: config.color }} />
              ) : (
                <StatusIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
          </Tooltip>

          {/* Title */}
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{
              flex: 1,
              lineHeight: 1.4,
              fontSize: "0.875rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              textDecoration:
                task.status === TaskStatus.COMPLETED ? "line-through" : "none",
              opacity: task.status === TaskStatus.COMPLETED ? 0.7 : 1,
            }}
          >
            {task.title}
          </Typography>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 0.25,
              flexShrink: 0,
            }}
          >
            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                sx={{
                  p: 0.5,
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                }}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                sx={{
                  p: 0.5,
                  opacity: 0.7,
                  color: "#ef4444",
                  "&:hover": { opacity: 1 },
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: "0.75rem",
              lineHeight: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.75,
          }}
        >
          <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: config.bgColor,
              color: config.color,
              fontWeight: 600,
              fontSize: "0.6875rem",
              height: 20,
              border: "none",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Schedule sx={{ fontSize: 12, color: "text.secondary" }} />
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="0.7rem"
            >
              {formatDate(task.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
