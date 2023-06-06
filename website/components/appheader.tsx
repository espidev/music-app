'use client'

import { Button, Typography } from "@mui/material";
import { getCookie, setCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

export default function AppHeader() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // TODO hook with cookie change
  useEffect(() => {
    const jwt = getCookie("token");
    setIsLoggedIn(jwt !== undefined && jwt !== '');

    if (isLoggedIn) {
      setUsername((jwtDecode(jwt as string) as any).data.username);
    }
  });

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
        isLoggedIn ? 
      
        <>
          <Typography style={{ paddingRight: "16px" }}>
            Hello, { username }
          </Typography>
          <Button 
            href="/login" 
            variant="outlined" 
            style={{ color: "white", borderColor: "white" }}
            onClick={() => {
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