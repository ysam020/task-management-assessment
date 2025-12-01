import { Chip, alpha } from "@mui/material";
import { TaskStatus } from "@/lib/types";
import { TASK_STATUS_CONFIG } from "@/lib/utils/constants";

interface StatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = TASK_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Chip
      label={config.label}
      icon={<Icon sx={{ fontSize: 16 }} />}
      onClick={onClick}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 24,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              bgcolor: alpha(config.color, 0.2),
            }
          : undefined,
      }}
    />
  );
}
