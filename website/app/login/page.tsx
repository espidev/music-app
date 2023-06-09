'use client'

import { apiPostLogin } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const appstate = useAppStateContext();

  const router = useRouter();

  const handleSubmit = () => {
    apiPostLogin(username, password)
      .then(res => {
        appstate.setLoggedIn(res.data.account);
        router.push('/');
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
          Login
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

          <Button 
            variant="outlined"
            disabled={password.length === 0}
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            onClick={() => handleSubmit()}
          >
            Login
          </Button>

          <Link 
            href="/register"
            style={{ color: "gray", textAlign: "right" }}
          >
            Don't have an account? Sign up
          </Link>
        </Box>
      </Box>
    </Container>
  );
}