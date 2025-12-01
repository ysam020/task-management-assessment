"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  alpha,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { LogoutOutlined, ChecklistRtlOutlined } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid",
        borderColor: alpha("#e2e8f0", 0.8),
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1, minHeight: { xs: 64, sm: 70 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mr: 3,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 16px rgba(102, 126, 234, 0.35)",
                },
              }}
            >
              <ChecklistRtlOutlined sx={{ color: "#ffffff", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.35rem",
                display: { xs: "none", sm: "block" },
                letterSpacing: "-0.5px",
              }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* User Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 0.75,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
                  border: "1px solid",
                  borderColor: alpha("#667eea", 0.15),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: alpha("#667eea", 0.3),
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.7rem",
                      display: "block",
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            )}

            {isMobile && (
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            )}

            {isMobile ? (
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  border: "1px solid",
                  borderColor: alpha("#ef4444", 0.2),
                  color: "#ef4444",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha("#ef4444", 0.1),
                    borderColor: "#ef4444",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <LogoutOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            ) : (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<LogoutOutlined fontSize="small" />}
                onClick={logout}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 2,
                  border: "1.5px solid",
                  borderColor: alpha("#ef4444", 0.3),
                  color: "#ef4444",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#ef4444",
                    bgcolor: alpha("#ef4444", 0.08),
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
