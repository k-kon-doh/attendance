"use client";

import { styled } from "@mui/material";

/** 詳細画面用サブタイトル */
export const Subtitle = styled("p")(({ theme }) => ({
  ...theme.typography.h5,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
}));
