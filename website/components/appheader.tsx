'use client'

import { Button, Typography } from "@mui/material";
import { redirect } from 'next/navigation';
import { useLoginStateContext } from "./loginstateprovider";

import '@/components/appheader.css';

export default function AppHeader() {
  const loginState = useLoginStateContext();

  const handleLogout = () => {
    loginState.setLoggedOut();
    redirect('/login');
  }

  return (
    <div className="app-header">

      <Typography variant="h6">
        Music App
      </Typography>

      <div className="right-component" />

      { 
        loginState.isLoggedIn ? 
      
        <>
          <Typography style={{ paddingRight: "16px" }}>
            Hello, { loginState.loggedInUsername }
          </Typography>

          <Button href="/login" variant="outlined" className="click-button" onClick={handleLogout}>
            Logout
          </Button>
        </>

        :
        
        <Button href="/login" variant="outlined" className="click-button">
          Login
        </Button>
      }
    </div>
  );
}