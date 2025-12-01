import React from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export interface InputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined";
  showPasswordToggle?: boolean;
}

export function Input({
  showPasswordToggle,
  type,
  variant = "outlined",
  InputProps,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle password toggle
  const inputType = type === "password" && showPassword ? "text" : type;

  const endAdornment =
    type === "password" && showPasswordToggle ? (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleTogglePassword}
          edge="end"
          size="small"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ) : (
      InputProps?.endAdornment
    );

  return (
    <TextField {...props} type={inputType} variant={variant} size="small" />
  );
}
