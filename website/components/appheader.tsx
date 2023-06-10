'use client'

import { Button, Typography } from "@mui/material";
import { setCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { useLoginStateContext } from "./loginstateprovider";

export default function AppHeader() {
  const loginState = useLoginStateContext();

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

      <div style={{ flexGrow: "1" }} />

      { 
        loginState.isLoggedIn ? 
      
        <>
          <Typography style={{ paddingRight: "16px" }}>
            Hello, { loginState.loggedInUsername }
          </Typography>
          <Button 
            href="/login" 
            variant="outlined" 
            style={{ color: "white", borderColor: "white" }}
            onClick={() => {
              loginState.setLoggedOut();
              redirect('/login');
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