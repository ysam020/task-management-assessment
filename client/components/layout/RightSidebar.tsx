"use client";

import { Box, Paper, Typography, alpha, Avatar } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { taskApi } from "@/lib/api/task.api";
import { Task, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/helper";
import { TASK_STATUS_CONFIG } from "@/lib/utils/constants";
import { useTasks } from "@/contexts/TaskContext";

export function RightSidebar() {
  const { onTaskChange } = useTasks();
  const [recentActivity, setRecentActivity] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecentActivity = async () => {
    try {
      setIsLoading(true);
      const tasks = await taskApi.getRecentActivity(5);
      setRecentActivity(tasks);
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRecentActivity();
  }, []);

  // Register callback to refresh when tasks change
  useEffect(() => {
    if (onTaskChange) {
      const unregister = onTaskChange(fetchRecentActivity);
      return unregister;
    }
  }, [onTaskChange]);

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        p: 1,
        borderLeft: "1px solid",
        borderColor: "divider",
        // background: "linear-gradient(180deg, #fefeff 0%, #f8f9ff 100%)",
        background: "linear-gradient(180deg, #f2f2fdff 0%, #edeffbff 100%)",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(102, 126, 234, 0.3)",
          borderRadius: "3px",
          "&:hover": {
            backgroundColor: "rgba(102, 126, 234, 0.5)",
          },
        },
      }}
    >
      {/* Recent Activity */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          border: "1px solid",
          borderColor: alpha("#667eea", 0.1),
          borderRadius: 2,
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: "0 2px 8px rgba(102, 126, 234, 0.08)",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            textTransform: "uppercase",
            color: "#667eea",
            letterSpacing: "0.5px",
          }}
        >
          <TrendingUp sx={{ fontSize: 16 }} />
          Recent Activity
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {isLoading ? (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 1.5,
                backgroundColor: alpha("#667eea", 0.05),
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.75rem"
              >
                Loading...
              </Typography>
            </Box>
          ) : recentActivity.length === 0 ? (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 1.5,
                backgroundColor: alpha("#667eea", 0.05),
                border: `1px dashed ${alpha("#667eea", 0.2)}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.75rem"
              >
                No recent activity
              </Typography>
            </Box>
          ) : (
            recentActivity.map((task) => {
              const statusConfig =
                TASK_STATUS_CONFIG[task.status as TaskStatus];
              const StatusIcon = statusConfig.icon;

              return (
                <Box
                  key={task.id}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: "#ffffff",
                    border: `1px solid ${alpha(statusConfig.color, 0.15)}`,
                    boxShadow: `0 2px 4px ${alpha(statusConfig.color, 0.08)}`,
                    transition: "all 0.25s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: statusConfig.bgColor,
                      borderColor: alpha(statusConfig.color, 0.3),
                      transform: "translateX(-4px)",
                      boxShadow: `0 4px 12px ${alpha(statusConfig.color, 0.2)}`,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.color,
                      fontSize: "0.75rem",
                      border: `2px solid ${alpha(statusConfig.color, 0.2)}`,
                    }}
                  >
                    <StatusIcon sx={{ fontSize: 18 }} />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.8rem",
                        mb: 0.25,
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        fontSize: "0.7rem",
                      }}
                    >
                      {formatDate(task.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default RightSidebar;
