'use client'

import { apiPostRegister } from "@/components/apiclient";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    apiPostRegister(username, password)
      .then(res => {
        redirect('/login');
      })
      .catch(err => {
        // TODO display popup with error message
      });
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h1" gutterBottom >
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField 
            required
            autoFocus
            fullWidth
            margin="normal"
            id="username" 
            label="Username" 
            variant="outlined"
            onChange={e => setUsername(e.target.value)}
          />

          <TextField
            required
            id="password" 
            label="Password" 
            type="password"
            fullWidth
            onChange={e => setPassword(e.target.value)}
          />

          <TextField 
            required
            id="confirmPassword" 
            label="Confirm Password" 
            type="password"
            sx={{ mt: 1, mb: 1 }}
            fullWidth
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <Button 
            variant="outlined"
            fullWidth
            disabled={password !== confirmPassword || password.length === 0}
            sx={{ mt: 1, mb: 1 }}
            onClick={() => handleSubmit()}
          >
            Register
          </Button>

          <Link 
            href="/login"
            style={{ color: "gray", textAlign: "right" }}
          >
            Already have an account? Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
}