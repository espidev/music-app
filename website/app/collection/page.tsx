'use client'


import { useEffect, useState } from "react";
import { apiGetCollectionTracks, apiGetCollectionTracksSearch } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import {Grid, TextField, Typography, InputAdornment} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useLoginStateContext } from "@/components/loginstateprovider";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import TrackTable from "@/components/trackTable";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset if empty
    if (event.target.value === '') {
        apiGetCollectionTracks(loginState.loggedInUserUuid)
            .then((res) => {
                setTracks(res.data as APITrack[]);
            });
        return;
    }

    // Call API to search for tracks
    apiGetCollectionTracksSearch(loginState.loggedInUserUuid, event.target.value).then((res) => {
      setTracks(res.data as APITrack[]);
    });
  }

  return (
    <Grid sx={{ height: 1 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Tracks</Typography>
        <TextField id="Search" label="Search" variant="outlined" InputProps={{
          startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
          ),
        }} onChange={handleSearch}/>
      </Grid>

      {/* Weird. paddingBottom works but not marginBottom. */}
      <Grid sx={{ paddingBottom: '5em' }}>
        <TrackTable tracks={tracks} handleTrackClick={handleTrackClick} />
      </Grid>
    </Grid>
  );
}
