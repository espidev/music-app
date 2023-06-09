'use client'

import { Button, Typography } from "@mui/material";
import { setCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { useAppStateContext } from "./appstateprovider";

export default function AppHeader() {
  const appstate = useAppStateContext();

  return (
    <div style={{ 
      padding: "12px", 
      background: "#1abc9c", 
      color: "white", 
      display: "flex", 
      flexWrap: "wrap",
      alignItems: "center",
    }}>
      <Typography variant="h6">
        Music App
      </Typography>

      <div style={{ flexGrow: "1" }}></div>
      
      { 
        appstate.isLoggedIn ? 
      
        <>
          <Typography style={{ paddingRight: "16px" }}>
            Hello, { appstate.loggedInUsername }
          </Typography>
          <Button 
            href="/login" 
            variant="outlined" 
            style={{ color: "white", borderColor: "white" }}
            onClick={() => {
              appstate.setLoggedOut();
              setCookie("token", undefined);
              redirect('/logout');
            }}
          >
            Logout
          </Button>
        </>

        :
        
        <Button 
          href="/login" 
          variant="outlined" 
          style={{ color: "white", borderColor: "white" }}
        >
          Login
        </Button>
      }
    </div>
  );
}