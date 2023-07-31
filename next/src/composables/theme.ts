"use client";
import { PaletteMode, Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { create } from "zustand";

type ThemeState = {
  mode: PaletteMode;
  theme: Theme;
  change: (theme: PaletteMode) => void;
};

/** テーマ */
const useTheme = create<ThemeState>((set) => ({
  mode: "light",
  theme: createTheme({ palette: { mode: "light" } }),
  change: (mode: PaletteMode) => set({ mode, theme: createTheme({ palette: { mode } }) }),
}));
export default useTheme;
