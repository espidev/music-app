'use client'

import format from 'format-duration';
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIAlbum } from '@/util/models/album';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertEntry } from '@/components/alerts';
import { apiGetCollectionAlbum, apiGetCollectionAlbumTracks } from '@/components/apiclient';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { APITrack } from '@/util/models/track';
import TrackTable from "@/components/trackTable";
import { useAppStateContext } from "@/components/appstateprovider";

export default function CollectionAlbumPage({params} : {params: {albumId: string}}) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const albumId = params.albumId;

  // const [albums, setAlbums] = useState([] as APIAlbum[]);
  const [album, setAlbum] = useState<APIAlbum>();
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

    // load album content
    apiGetCollectionAlbum(albumId)
      .then(res => {
          console.log(res.data);
          setAlbum(res.data as APIAlbum);

          // Fetch and set the tracks
          apiGetCollectionAlbumTracks(albumId).then(res_tracks => {
            setTracks(res_tracks.data as APITrack[]);
          })
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching artists, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  if (!album) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeTrack(track);
  }

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
  

  const totalTime = formatDuration(tracks.reduce((acc, track) => acc + track.audio_length, 0));
  const trackLength = tracks.length;
  const suffix = trackLength === 1 ? 'song' : 'songs';

  return (
    <div>
      <Box>
        <div style={
          {
            display: 'flex',
            // backgroundColor: 'pink',
            margin: 'auto',
            alignItems: 'center',
            zIndex: 2,
          }
        }>
          <Box
            component="img"
            alt="album_cover"
            sx={{ width: "15em", height: "15em", objectFit: "cover", padding: 2, margin: 2 }}
            src={album.thumbnail_src}
          />

          <div style={{ display: 'flex', flexDirection: "column"}}>
            <Typography variant="h3">{album.name}</Typography>
            <Typography variant="h6">{album.album_artist}</Typography>
            <Typography variant="subtitle2">{trackLength} {suffix} • {totalTime}</Typography>
            <Button variant="outlined"  style={{ width: '5vw', marginTop: '2em', color: 'black' }}>
              <PlayArrowIcon fontSize="medium" style={{ color: '#000', marginLeft: '-0.3em' }} />Play
            </Button>
          </div>
        </div>

        <TrackTable tracks={tracks} handleTrackClick={handleTrackClick} />
      </Box>
    </div>
  );
}
