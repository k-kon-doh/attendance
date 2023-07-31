"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Drawer, IconButton, Switch, Toolbar, Typography } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { create } from "zustand";

import LoginEmployee from "@/components/authenticate";
import Title from "@/components/title";
import useTheme from "@/composables/theme";

type DrawerState = {
  open: boolean;
  toggle: (value: boolean | undefined) => void;
};

const useDrawer = create<DrawerState>((set, get) => ({
  open: false,
  toggle: (value: boolean | undefined) => set({ open: value ?? !get().open }),
}));

/** コンテンツレイアウト */
export default function Contents({ children }: { children: React.ReactNode }) {
  const open = useDrawer((state) => state.open);
  const toggle = useDrawer((state) => state.toggle);
  const mode = useTheme((state) => state.mode);
  const change = useTheme((state) => state.change);
  return (
    <Box sx={{ bgcolor: "background.paper", display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
      <Box sx={{ flexGrow: 0, flexShrink: 0, position: "sticky", top: 0, zIndex: (theme) => theme.zIndex.drawer + 2 }}>
        <AppBar component="header" position="static">
          <Toolbar>
            <IconButton aria-label="menu" color="inherit" edge="start" onClick={() => toggle(undefined)} size="large" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Title />
            </Typography>
            <LoginEmployee />
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          sx={{
            width: "240px",
            flexShrink: 1,
            "& .MuiDrawer-paper": {
              width: "240px",
              boxSizing: "border-box",
            },
          }}
          onClose={() => toggle(false)}
          open={open}
          variant="temporary"
        >
          <Toolbar />
          <Box>
            <p>
              <Switch onChange={(event) => change(event.currentTarget.checked ? "dark" : "light")} checked={mode == "dark"}></Switch>Theme
            </p>
            <p>※ 以下割愛</p>
          </Box>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, flexShrink: 1, overflowY: "auto", p: 2, width: "100%" }}>
        {children}
      </Box>
      <Box sx={{ bottom: 0, flexGrow: 0, flexShrink: 0, position: "sticky", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AppBar component="footer" position="static">
          <Toolbar>
            <div style={{ flexGrow: 1 }}></div>
            <Typography color="white" variant="body1">
              k-kon-doh
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <SnackbarProvider />
    </Box>
  );
}
