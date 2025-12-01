import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  CardProps as MuiCardProps,
  alpha,
} from "@mui/material";
import { ReactNode } from "react";

export interface CardProps extends Omit<MuiCardProps, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  hoverable?: boolean;
  hoverColor?: string;
  noPadding?: boolean;
  compact?: boolean;
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  hoverable = false,
  hoverColor,
  noPadding = false,
  compact = false,
  elevation = 0,
  sx,
  ...props
}: CardProps) {
  return (
    <MuiCard
      elevation={elevation}
      {...props}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: compact ? 1.5 : 2,
        transition: "all 0.2s ease",
        boxShadow: compact ? "0 1px 3px rgba(0,0,0,0.08)" : undefined,
        ...(hoverable && {
          cursor: "pointer",
          "&:hover": {
            transform: compact ? undefined : "translateY(-2px)",
            boxShadow: hoverColor
              ? `0 6px 16px ${alpha(hoverColor, 0.2)}`
              : compact
              ? "0 4px 12px rgba(102, 126, 234, 0.15)"
              : "0 4px 12px rgba(102, 126, 234, 0.15)",
            borderColor:
              hoverColor || ((theme) => alpha(theme.palette.primary.main, 0.3)),
          },
        }),
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          sx={{
            pb: noPadding ? 0 : compact ? 1 : 2,
            pt: compact ? 1.5 : 2,
            px: compact ? 1.5 : 2,
            "& .MuiCardHeader-title": {
              fontSize: compact ? "0.875rem" : "1rem",
              fontWeight: 600,
            },
          }}
        />
      )}
      <CardContent
        sx={{
          p: noPadding ? 0 : compact ? 1.5 : 2,
          "&:last-child": { pb: noPadding ? 0 : compact ? 1.5 : 2 },
        }}
      >
        {children}
      </CardContent>
      {actions && (
        <CardActions sx={{ px: compact ? 1.5 : 2, pb: compact ? 1.5 : 2 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
}
