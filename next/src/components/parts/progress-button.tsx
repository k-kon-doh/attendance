"use client";

import { Button, ButtonProps, CircularProgress, CircularProgressProps, SxProps, Theme } from "@mui/material";

export type ProgressButtonProps = ButtonProps & {
  pending?: boolean;
  circularProgressProps?: CircularProgressProps;
};

export default function ProgressButton({ children, circularProgressProps, pending, ...restProps }: ProgressButtonProps) {
  const { disabled, ...restButtonProps } = restProps;
  const buttonProps: ButtonProps = { color: "secondary", disabled: disabled ?? false, variant: "outlined", ...restButtonProps };
  const { sx, ...restProgressProps } = circularProgressProps ?? {};
  const sxProps: SxProps<Theme> = { opacity: disabled ? 0.38 : 1, ...sx };
  const progressProps: CircularProgressProps = { color: "secondary", size: "1.4rem", sx: sxProps, ...restProgressProps };
  return <Button {...buttonProps}>{pending === true ? <CircularProgress {...progressProps} /> : <>{children}</>}</Button>;
}
