'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionFavourites } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import {Grid, Typography, CssBaseline} from "@mui/material";
import { useRouter } from "next/navigation";
import { useLoginStateContext } from "@/components/loginstateprovider";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import TrackTable from "@/components/trackTable";
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '@/components/themes';
import {styled} from '@mui/system';

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgb(5, 10, 25)' : 'rgb(255, 245, 245)',
}));

export default function CollectionPage() {
  const appState = useAppStateContext();
  const theme = appState.theme;
  const loginState = useLoginStateContext();
  const router = useRouter();

  const color = theme === 'dark' ? 'white' : 'rgb(50, 50, 50)';

  const [tracks, setTracks] = useState([] as APITrack[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const loadTracks = () => {
    apiGetCollectionFavourites(loginState.loggedInUserUuid)
      .then((res) => {
        setTracks(res.data as APITrack[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching tracks, see console for details." }]);
        console.error(err);
      });
  };

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
    loadTracks();
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeQueue(tracks, tracks.indexOf(track));
    appState.playCurrentTrack();
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <StyledGrid>
        <AlertComponent alerts={alerts} setAlerts={setAlerts} />

        <Grid sx={{ padding: 2, color: color }} container direction="row" justifyContent="space-between">
          <Typography variant="h6">Favourites</Typography>
        </Grid>

        {/* Weird. paddingBottom works but not marginBottom. */}
        <Grid sx={{ paddingBottom: '5em' }}>
          <TrackTable 
            tracks={tracks} 
            handleTrackClick={handleTrackClick}
            handleTrackUpdate={loadTracks}
          />
        </Grid>
      </StyledGrid>
    </ThemeProvider>
  );
}
