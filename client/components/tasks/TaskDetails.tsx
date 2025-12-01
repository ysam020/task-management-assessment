"use client";

import { Box, Typography, Chip, Stack, alpha } from "@mui/material";
import { Schedule, CalendarToday } from "@mui/icons-material";
import { Modal } from "@/components/common/Modal";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils/helper";
import { TASK_STATUS_CONFIG } from "@/lib/utils/constants";

interface TaskDetailProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

export function TaskDetail({ task, open, onClose }: TaskDetailProps) {
  if (!task) return null;

  const config = TASK_STATUS_CONFIG[task.status];
  const StatusIcon = config.icon;

  return (
    <Modal open={open} onClose={onClose} title="Task Details" maxWidth="xs">
      <Stack spacing={2}>
        {/* Status */}
        <Chip
          icon={<StatusIcon sx={{ fontSize: 16 }} />}
          label={config.label}
          sx={{
            backgroundColor: config.bgColor,
            color: config.color,
            fontWeight: 600,
            fontSize: "0.8rem",
            height: 28,
            border: `1px solid ${alpha(config.color, 0.2)}`,
            "& .MuiChip-icon": {
              color: config.color,
            },
          }}
        />

        {/* Title */}
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}
          >
            TITLE
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
            {task.title}
          </Typography>
        </Box>

        {/* Description */}
        {task.description && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}
            >
              DESCRIPTION
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.6}
              fontSize="0.875rem"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {task.description}
            </Typography>
          </Box>
        )}

        {/* Timestamps */}
        <Stack direction="row" spacing={1}>
          {/* Created */}
          <Box
            sx={{
              flex: 1,
              p: 1,
              borderRadius: 1.5,
              backgroundColor: alpha("#667eea", 0.05),
              border: `1px solid ${alpha("#667eea", 0.15)}`,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              <CalendarToday sx={{ fontSize: 14, color: "#667eea" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.65rem"
                fontWeight={600}
              >
                Created
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
              {formatDate(task.createdAt)}
            </Typography>
          </Box>

          {/* Updated */}
          <Box
            sx={{
              flex: 1,
              p: 1,
              borderRadius: 1.5,
              backgroundColor: alpha("#10b981", 0.05),
              border: `1px solid ${alpha("#10b981", 0.15)}`,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              <Schedule sx={{ fontSize: 14, color: "#10b981" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.65rem"
                fontWeight={600}
              >
                Updated
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={600} fontSize="0.75rem">
              {formatDate(task.updatedAt)}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  );
}
