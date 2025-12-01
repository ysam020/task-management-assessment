"use client";

import {
  Box,
  Button,
  Paper,
  Typography,
  MenuItem,
  Chip,
  alpha,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { useTasks } from "@/contexts/TaskContext";
import { TaskStatus } from "@/lib/types";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebouce";
import {
  DEBOUNCE_DELAY,
  STAT_ITEMS,
  TASK_STATUS_OPTIONS,
  SORT_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "@/lib/utils/constants";

interface LeftSidebarProps {
  onCreateTask: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export function LeftSidebar({
  onCreateTask,
  isCreateModalOpen,
  setIsCreateModalOpen,
}: LeftSidebarProps) {
  const { stats, filters, setFilters } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY.SEARCH);

  useEffect(() => {
    // Compare current search value with new debounced value
    const currentSearch = filters.search || "";
    const newSearch = debouncedSearch?.trim() || "";

    // Only update if the value has changed
    if (currentSearch !== newSearch) {
      const newFilters = { ...filters, page: 1 };

      if (newSearch) {
        newFilters.search = newSearch;
      } else {
        delete newFilters.search;
      }

      setFilters(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 1,
        background: "linear-gradient(180deg, #f2f2fdff 0%, #edeffbff 100%)",
        borderRight: "1px solid",
        borderColor: "divider",
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
      {/* Create Task Button */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<Add />}
        onClick={onCreateTask}
        sx={{
          py: 1.25,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #5568d3 0%, #6a3f94 100%)",
            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
          },
        }}
      >
        Create Task
      </Button>

      {/* Search */}
      <Input
        fullWidth
        size="small"
        placeholder="Search tasks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            fontSize: "0.875rem",
          },
        }}
      />

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          border: "1px solid",
          borderColor: alpha("#667eea", 0.1),
          borderRadius: 2,
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            color: "#667eea",
            letterSpacing: "0.5px",
          }}
        >
          Filters
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Input
            select
            fullWidth
            size="small"
            label="Status"
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as TaskStatus | undefined,
                page: 1,
              })
            }
            sx={{ fontSize: "0.875rem" }}
          >
            <MenuItem value="">All</MenuItem>
            {TASK_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Input>

          <Input
            select
            fullWidth
            size="small"
            label="Sort By"
            value={filters.sortBy || "createdAt"}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: e.target.value as "createdAt" | "updatedAt" | "title",
                page: 1,
              })
            }
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Input>

          <Input
            select
            fullWidth
            size="small"
            label="Order"
            value={filters.sortOrder || "desc"}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortOrder: e.target.value as "asc" | "desc",
                page: 1,
              })
            }
          >
            {SORT_ORDER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Input>
        </Box>
      </Paper>

      {/* Stats */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          border: "1px solid",
          borderColor: alpha("#667eea", 0.1),
          borderRadius: 2,
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            color: "#667eea",
            letterSpacing: "0.5px",
          }}
        >
          Statistics
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {STAT_ITEMS.map((item) => {
            const StatIcon = item.icon;
            const value = stats?.[item.key as keyof typeof stats] || 0;

            return (
              <Box
                key={item.key}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: item.bgColor,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(item.color, 0.15),
                    transform: "translateX(2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 1,
                      backgroundColor: alpha(item.color, 0.15),
                      color: item.color,
                    }}
                  >
                    <StatIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    fontSize="0.75rem"
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Chip
                  label={value}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    backgroundColor: alpha(item.color, 0.2),
                    color: item.color,
                    border: `1px solid ${alpha(item.color, 0.3)}`,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Create Task Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSuccess={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </Box>
  );
}
