'use client'
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AppHeader() {
  return (
    <div style={{ padding: "12px", background: "#1abc9c", color: "white" }}>
      <Typography variant="h6" noWrap component="div">
        Music App
      </Typography>
    </div>
  );
}