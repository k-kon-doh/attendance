"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";

import { NextAppDirEmotionCacheProvider } from "@/components/emotion-cache";
import useTheme from "@/composables/theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = useTheme((state) => state.theme);
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
