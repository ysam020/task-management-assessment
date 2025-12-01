"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useTasks } from "@/contexts/TaskContext";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MainContent } from "@/components/layout/MainContent";
import { RightSidebar } from "@/components/layout/RightSidebar";

export default function DashboardPage() {
  const { fetchTaskStats } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "250px 1fr",
          lg: "320px 1fr 320px",
        },
        gap: { xs: 2, md: 3 },
        height: { xs: "auto", md: "calc(100vh - 64px)" },
        minHeight: { xs: "calc(100vh - 64px)", md: "auto" },
        overflow: { xs: "visible", md: "hidden" },
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* Mobile Filter Button */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => setIsFilterDrawerOpen(true)}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              color: "white",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.5)",
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 6px 16px rgba(102, 126, 234, 0.6)",
              },
            }}
          >
            <FilterList />
          </IconButton>
        </Box>
      )}

      {/* Left Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 320,
              p: 0,
            },
          }}
        >
          <LeftSidebar
            onCreateTask={() => {
              setIsCreateModalOpen(true);
              setIsFilterDrawerOpen(false);
            }}
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </Drawer>
      ) : (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <LeftSidebar
            onCreateTask={() => setIsCreateModalOpen(true)}
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </Box>
      )}

      {/* Main Content */}
      <MainContent />

      {/* Right Sidebar (Desktop only) */}
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <RightSidebar />
      </Box>
    </Box>
  );
}
