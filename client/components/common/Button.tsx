"use client";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  alpha,
  CircularProgress,
} from "@mui/material";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "outlined" | "danger";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  sx,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #5568d3 0%, #6a4190 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.35)",
          },
          "&:disabled": {
            background: alpha("#667eea", 0.3),
            color: alpha("#ffffff", 0.7),
            boxShadow: "none",
          },
        };

      case "secondary":
        return {
          background: alpha("#667eea", 0.1),
          color: "#667eea",
          border: "1.5px solid",
          borderColor: alpha("#667eea", 0.3),
          "&:hover": {
            background: alpha("#667eea", 0.15),
            borderColor: "#667eea",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            background: alpha("#667eea", 0.05),
            color: alpha("#667eea", 0.4),
            borderColor: alpha("#667eea", 0.2),
          },
        };

      case "outlined":
        return {
          border: "1.5px solid",
          borderColor: alpha("#94a3b8", 0.3),
          color: "#64748b",
          background: "transparent",
          "&:hover": {
            borderColor: "#94a3b8",
            bgcolor: alpha("#94a3b8", 0.08),
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            borderColor: alpha("#94a3b8", 0.2),
            color: alpha("#94a3b8", 0.5),
          },
        };

      case "danger":
        return {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(239, 68, 68, 0.35)",
          },
          "&:disabled": {
            background: alpha("#ef4444", 0.3),
            color: alpha("#ffffff", 0.7),
            boxShadow: "none",
          },
        };

      default:
        return {};
    }
  };

  return (
    <MuiButton
      disabled={disabled || loading}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        px: 3,
        py: 1,
        borderRadius: 2,
        transition: "all 0.2s ease",
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={20}
          sx={{
            color: variant === "outlined" ? "#667eea" : "#ffffff",
          }}
        />
      ) : (
        children
      )}
    </MuiButton>
  );
}
