"use client";

import { Box, CircularProgress } from "@mui/material";

/** ローディング表示 */
export default function Loding() {
  return (
    <Box sx={{ marginTop: "50px", width: "100%" }}>
      <CircularProgress sx={{ color: "orange", display: "block", margin: "auto" }} />
    </Box>
  );
}
