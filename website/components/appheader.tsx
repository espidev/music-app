'use client'

import { createContext, useContext } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import { redirect } from 'next/navigation';
import { useLoginStateContext } from "./loginstateprovider";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppStateContext } from "./appstateprovider";
// import '@/components/appheader.css';
// import styled from 'styled-components';

export default function AppHeader() {
  const loginState = useLoginStateContext();
  const appState = useAppStateContext();
  const theme = appState.theme;

  const handleLogout = () => {
    loginState.setLoggedOut();
    redirect('/login');
  }

  // const header = {
  //   padding: "1em",
  //   color: "white",
  //   display: "flex",
  //   flexWrap: "wrap",
  //   alignItems: "center",
  //   zIndex: 10,
  //   position: "fixed",
  //   top: 0,
  //   width: "100%",
  //   backdropFilter: "blur(3px)",
  //   background: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(25, 118, 210, 0.9)',
  // };

  const button = {
    color: "white",
    borderColor: "white"
  };

  return (
    <div style={{
      padding: "1em",
      color: "white",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      zIndex: 10,
      position: "fixed",
      top: 0,
      width: "100%",
      backdropFilter: "blur(3px)",
      background: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(25, 118, 210, 0.9)',
    }}>

      <Typography variant="h6">
        Music App
      </Typography>

      <div style={{flexGrow: 1}} />

      {
        loginState.isLoggedIn ? 
      
        <>
          <IconButton sx={{ ml: 1 }} onClick={appState.toggleTheme} color="inherit">
            {appState.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Typography style={{ paddingRight: "16px" }}>
            Hello, { loginState.loggedInUsername }
          </Typography>

          <Button href="/login" variant="outlined" style={button} onClick={handleLogout}>
            Logout
          </Button>
        </>

        :
        
        <Button href="/login" variant="outlined" style={button}>
          Login
        </Button>
      }
    </div>
  );
}