'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionHotCharts, apiGetCollectionTracks, apiGetCollectionTracksSearch } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import { Grid, Typography, CssBaseline } from "@mui/material";
import { useRouter } from "next/navigation";
import { useLoginStateContext } from "@/components/loginstateprovider";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '@/components/themes';
import {styled} from '@mui/system';
import TrackTable from "@/components/trackTable";
import { APIArtist } from "@/util/models/artist";
import ArtistCard from "@/components/artistCard";

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgb(5, 10, 25)' : 'rgb(255, 245, 245)',
}));

export default function CollectionHotChartsPage() {
  const appState = useAppStateContext();
  const theme = appState.theme;
  const loginState = useLoginStateContext();
  const router = useRouter();

  const color = theme === 'dark' ? 'white' : 'rgb(50, 50, 50)';

  const [tracks, setTracks] = useState([] as APITrack[]);
  const [artists, setArtists] = useState([] as APIArtist[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const loadTracks = () => {
    apiGetCollectionHotCharts(loginState.loggedInUserUuid)
      .then((res) => {
        const topTracks = res.data.top_tracks;
        const topArtists = res.data.top_artists;

        setTracks(topTracks);
        setArtists(topArtists);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching hot charts, see console for details." }]);
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
          <Typography variant="h6">Your Top Albums & Tracks</Typography>
        </Grid>

        <Grid sx={{ display: "flex", padding: 2 }}>
          {
            artists.filter(artist => artist).map((artist, index) => (
              <ArtistCard artist={artist} key={index} />
            ))
          }
        </Grid>

        {/* Weird. paddingBottom works but not marginBottom. */}
        <Grid sx={{ paddingBottom: '5em' }}>
          <TrackTable 
            tracks={tracks} 
            handleTrackClick={handleTrackClick} 
            showRankingCol={true}
            handleTrackUpdate={loadTracks} 
          />
        </Grid>
      </StyledGrid>
    </ThemeProvider>
  );
}
