'use client'

import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIPlaylist } from '@/util/models/playlist';
import { Box, Typography, Button, TextField, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertEntry } from "@/components/alerts";
import { apiGetPlaylist, apiGetPlaylistTracks, apiPostCreatePlaylist } from "@/components/apiclient";
import { APITrack } from "@/util/models/track";
import TrackTable from "@/components/trackTable";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAppStateContext } from "@/components/appstateprovider";

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (duration < 3600) {
    return `${minutes} minutes ${seconds} seconds`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours and ${remainingMinutes} minutes`;
  }
}

export default function CollectionPlaylistPage({params} : {params: {playlistId: string}}) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const playlistId = params.playlistId;

  const [playlist, setPlaylist] = useState<APIPlaylist>();
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

    // load playlist content
    apiGetPlaylist(playlistId)
      .then(res => {
        setPlaylist(res.data as APIPlaylist);

        // Fetch and set the tracks
        apiGetPlaylistTracks(playlistId).then(resTracks => {
          setTracks(resTracks.data as APITrack[]);
        })
        .catch(err => {
          setAlerts([...alerts, { severity: "error", message: "Error fetching playlist track list, see console for details." }]);
          console.error(err);
        });

      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching playlist, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  if (!playlist) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeQueue(tracks, tracks.indexOf(track));
    appState.playCurrentTrack();
  }

  const totalTime = formatDuration(tracks.reduce((acc, track) => acc + track.audio_length, 0));
  const suffix = tracks.length === 1 ? 'song' : 'songs';

  return (
    <div>
      <Box>
        <div style={
          {
            display: 'flex',
            margin: 'auto',
            alignItems: 'center',
            zIndex: 2,
          }
        }>
          <Box
            component="img"
            alt="album_cover"
            sx={{ width: "15em", height: "15em", objectFit: "cover", padding: 2, margin: 2 }}
            src={`/api/playlist/${playlistId}/thumbnail`}
          />

          <div style={{ display: 'flex', flexDirection: "column"}}>
            <Typography variant="h3">{playlist.name}</Typography>
            <Typography variant="subtitle2">{tracks.length} {suffix} • {totalTime}</Typography>
            <Button 
              variant="outlined"  
              style={{
                width: "5vw",
                marginTop: "2em",
                color: appState.theme === "dark" ? "white" : "",
                borderColor: appState.theme === "dark" ? "white" : ""
              }}
              onClick={() => {
                appState.changeQueue(tracks, 0);
                appState.playCurrentTrack();
              }}
            >
              <PlayArrowIcon fontSize="medium" style={{ marginLeft: '-0.3em' }} />Play
            </Button>
          </div>
        </div>

        <TrackTable tracks={tracks} handleTrackClick={handleTrackClick} />
      </Box>
    </div>
  );
}
