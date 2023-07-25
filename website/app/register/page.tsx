'use client'

import { apiPostRegister } from "@/components/apiclient";
import { Box, Button, Container, TextField, Typography, Checkbox, FormLabel } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import totp from "totp-generator";
// @ts-ignore
import base32 from "thirty-two";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpConf, setTotpConf] = useState("");
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const router = useRouter();

  const handleSubmit = () => {
    apiPostRegister(username, password, totpSecret)
      .then(res => {
            setAlerts([...alerts, { severity: "success", message: "Registration successful!" }]);
            router.push('/login');
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Issue with registration, see console for details." }]);
        console.error(err);
      });
  };

    return (
    <Container maxWidth="xs">
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

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

          <Checkbox
            checked={totpEnabled}
            onChange={e => {
              setTotpEnabled(e.target.checked);
              if (!e.target.checked) {
                setTotpSecret("");
              } else {
                // Generate random secret
                  const str = Math.random().toString(36)
                  setTotpSecret(base32.encode(str).toString().slice(0, 8))
              }
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <FormLabel>Enable TOTP</FormLabel>

          {totpEnabled && <><Typography variant="body2" gutterBottom>
            Put this TOTP secret into your authenticator app: {totpSecret}
          </Typography><TextField
              required
              id="totp"
              label="TOTP"
              fullWidth
              disabled={!totpEnabled}
              onChange={e => setTotpConf(e.target.value)}/></>}

          <Button
            variant="outlined"
            fullWidth
            disabled={password !== confirmPassword || password.length === 0 || totpEnabled && totp(totpSecret).toString() !== totpConf}
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
