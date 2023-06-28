'use client'

import AlertComponent, { AlertEntry } from "@/components/alerts";
import { apiGetCollectionArtists } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIArtist } from "@/util/models/artist";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionArtistsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [artists, setArtists] = useState([] as APIArtist[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  useEffect(() => {
    // wait for credentials to be loaded
    if (!loginState.loggedInStateValid) {
      return;
    }

    // if not logged in, go to login page
    if (!loginState.isLoggedIn) {
      router.push('/login');
      return;
    }

    // load artists
    apiGetCollectionArtists(loginState.loggedInUserUuid)
      .then(res => {
        setArtists(res.data as APIArtist[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching artists, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  return (
    <Box sx={{ height: 1 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Artists</Typography>
      </Box>
    </Box>
  );
}