'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionPlaylists } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { APIPlaylist } from "@/util/models/playlist";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { Typography, Grid } from "@mui/material";
// Import components for playlist cards or list items (if available)

export default function CollectionPlaylistsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [playlists, setPlaylists] = useState([] as APIPlaylist[]);
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

    // load playlists
    apiGetCollectionPlaylists(loginState.loggedInUserUuid)
      .then((res) => {
        setPlaylists(res.data as APIPlaylist[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching playlists, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  return (
    <Grid sx={{ position: 'absolute', width: 0.83 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />
      
      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Playlists</Typography>
      </Grid>

      {/* Add the playlist cards or list items here */}
    </Grid>
  );
}
