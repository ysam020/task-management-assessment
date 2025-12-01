"use client";

import { Box, Typography, IconButton, alpha } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { useTasks } from "@/contexts/TaskContext";

export function TaskPagination() {
  const { pagination, filters, setFilters } = useTasks();

  if (!pagination) return null;

  const { page, totalPages, hasPrev, hasNext, limit, total } = pagination;

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Calculate the range of items being shown
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        background: "linear-gradient(180deg, #f2f2fdff 0%, #edeffbff 100%)",
        p: 1,
        borderRadius: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
        Showing{" "}
        <strong>
          {startItem}-{endItem}
        </strong>{" "}
        of <strong>{total}</strong>
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handlePageChange(1)}
            disabled={!hasPrev}
            sx={{
              border: "1px solid",
              borderColor: alpha("#4338ca", 0.7),
              width: 28,
              height: 28,
              color: "primary.main",
              "&:hover": {
                backgroundColor: alpha("#4338ca", 0.16),
                borderColor: "#4338ca",
              },
              "&.Mui-disabled": {
                color: "#94a3b8",
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                opacity: 1,
              },
            }}
          >
            <FirstPage sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev}
            sx={{
              border: "1px solid",
              borderColor: alpha("#4338ca", 0.7),
              width: 28,
              height: 28,
              color: "primary.main",
              "&:hover": {
                backgroundColor: alpha("#4338ca", 0.16),
                borderColor: "#4338ca",
              },
              "&.Mui-disabled": {
                color: "#94a3b8",
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                opacity: 1,
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: 18 }} />
          </IconButton>

          <Box
            sx={{
              px: 1.5,
              py: 0.25,
              backgroundColor: alpha("#4338ca", 0.08),
              borderRadius: 1,
              minWidth: 64,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary"
              fontSize="0.75rem"
            >
              {page} / {totalPages}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
            sx={{
              border: "1px solid",
              borderColor: alpha("#4338ca", 0.7),
              width: 28,
              height: 28,
              color: "primary.main",
              "&:hover": {
                backgroundColor: alpha("#4338ca", 0.16),
                borderColor: "#4338ca",
              },
              "&.Mui-disabled": {
                color: "#94a3b8",
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                opacity: 1,
              },
            }}
          >
            <ChevronRight sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNext}
            sx={{
              border: "1px solid",
              borderColor: alpha("#4338ca", 0.7),
              width: 28,
              height: 28,
              color: "primary.main",
              "&:hover": {
                backgroundColor: alpha("#4338ca", 0.16),
                borderColor: "#4338ca",
              },
              "&.Mui-disabled": {
                color: "#94a3b8",
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                opacity: 1,
              },
            }}
          >
            <LastPage sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
