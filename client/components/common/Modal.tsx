import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ReactNode } from "react";

export interface ModalProps extends Omit<DialogProps, "title"> {
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export function Modal({
  title,
  children,
  actions,
  onClose,
  showCloseButton = true,
  ...props
}: ModalProps) {
  return (
    <Dialog onClose={onClose} {...props} maxWidth="sm" fullWidth>
      {title && (
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="span" variant="h6">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
