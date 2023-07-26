'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionTracks, apiGetCollectionTracksSearch } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import {Grid, TextField, Typography, InputAdornment, CssBaseline} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useLoginStateContext } from "@/components/loginstateprovider";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '@/components/themes';
import {styled} from '@mui/system';
import TrackTable from "@/components/trackTable";
import { APIAlbum } from "@/util/models/album";
import AlbumCard from "@/components/albumCard";

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
  const [albums, setAlbums] = useState([] as APIAlbum[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const loadTracks = () => {
    apiGetCollectionTracks(loginState.loggedInUserUuid)
      .then((res) => {
        // Only show top 10 tracks
        const topTracks = res.data.slice(0, Math.min(10, res.data?.length)) as APITrack[];
        let topAlbums = topTracks.map((track: APITrack) => track.albums[0]);
        topAlbums = topAlbums.filter((album: APIAlbum) => album !== undefined);
        topAlbums = topAlbums.slice(0, Math.min(5, topAlbums.length));
        setTracks(res.data.slice(0, Math.min(10, res.data?.length)) as APITrack[]);
        setAlbums(topAlbums as APIAlbum[]);
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
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <StyledGrid>
        <AlertComponent alerts={alerts} setAlerts={setAlerts} />

        <Grid sx={{ padding: 2, color: color }} container direction="row" justifyContent="space-between">
          <Typography variant="h6">Your Top Albums & Tracks</Typography>
          <TextField id="Search" label="Search" variant="outlined" 
            sx={{borderBlockColor: theme === "dark" ? "red" : "rgb(50, 50, 50)",}}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start" sx={{color: color}}>
                  <Search />
                </InputAdornment>
            ),
          }} onChange={handleSearch}/>
        </Grid>

        {/* TODO: Top artists section? */}
        <Grid sx={{ display: "flex", padding: 2 }}>
          {albums.map((album, index) => {
            if (album)
              return <AlbumCard album={album} key={index} />;
          })}
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
