'use client'

import AlertComponent, { AlertEntry } from "@/components/alerts";
import { apiGetCollectionAlbums } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIAlbum } from "@/util/models/album";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionAlbumsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [albums, setAlbums] = useState([] as APIAlbum[]);
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

    // load albums
    apiGetCollectionAlbums(loginState.loggedInUserUuid)
      .then((res) => {
        setAlbums(res.data as APIAlbum[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching albums, see console for details." }]);
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
        <Typography variant="h6">Albums</Typography>
      </Box>
    </Box>
  );
}