'use client'

import { apiGetCollectionTracks } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import '@/components/tracktable.css';
import { useLoginStateContext } from "@/components/loginstateprovider";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import TrackTable from "@/components/trackTable";

export default function CollectionPage() {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [tracks, setTracks] = useState([] as APITrack[]);
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

    // load tracks
    apiGetCollectionTracks(loginState.loggedInUserUuid)
      .then((res) => {
        setTracks(res.data as APITrack[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching tracks, see console for details." }]);
        console.error(err);
      });
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeTrack(track);
  };

  return (
    <Box sx={{ height: 1 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Tracks</Typography>
      </Box>

      <TrackTable tracks={tracks} handleTrackClick={handleTrackClick} />
    </Box>
  );
}