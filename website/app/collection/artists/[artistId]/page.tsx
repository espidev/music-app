"use client";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIArtist } from "@/util/models/artist";
import { APIAlbum } from "@/util/models/album";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertEntry } from "@/components/alerts";
import {
  apiGetArtist,
  apiGetArtistTracks,
  apiGetArtistAlbums,
} from "@/components/apiclient";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { APITrack } from "@/util/models/track";
import TrackTable from "@/components/trackTable";
import { useAppStateContext } from "@/components/appstateprovider";
import AlbumCard from "@/components/albumCard";

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

export default function CollectionArtistPage({
  params,
}: {
  params: { artistId: string };
}) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const artistId = params.artistId;

  const [artist, setArtist] = useState<APIArtist>();
  const [tracks, setTracks] = useState([] as APITrack[]);
  const [albums, setAlbums] = useState([] as APIAlbum[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  useEffect(() => {
    // wait for credentials to be loaded
    if (!loginState.loggedInStateValid) {
      return;
    }

    // if not logged in, go to login page
    if (!loginState.isLoggedIn) {
      router.push("/login");
      return;
    }

    // load artist content
    apiGetArtist(artistId)
      .then((res) => {
        setArtist(res.data as APIArtist);

        // Fetch and set the tracks
        apiGetArtistTracks(artistId).then((res_tracks) => {
          setTracks(res_tracks.data as APITrack[]);
        });
        // Fetch and set the tracks
        apiGetArtistAlbums(artistId).then((res_albums) => {
          setAlbums(res_albums.data as APIAlbum[]);
        });
      })
      .catch((err) => {
        setAlerts([
          ...alerts,
          {
            severity: "error",
            message: "Error fetching artists, see console for details.",
          },
        ]);
        console.error(err);
      });
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  if (!artist) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeQueue(tracks, tracks.indexOf(track));
    appState.playCurrentTrack();
  };

  const totalTime = formatDuration(
    tracks.reduce((acc, track) => acc + track.audio_length, 0)
  );
  
  const trackLength = tracks.length;
  const trackSuffix = trackLength === 1 ? "song" : "songs";
  const albumLength = albums.length;
  const albumSuffix = albumLength === 1 ? "album" : "albums";

  return (
    <div>
      <Box>
        <div
          style={{
            display: "flex",
            margin: "auto",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            alt="album_cover"
            sx={{
              width: "15em",
              height: "15em",
              objectFit: "cover",
              padding: 2,
              margin: 2,
            }}
            src={albums.length > 0 ? `/api/album/${albums[0].id}/thumbnail` : (tracks.length > 0 ? `/api/track/${tracks[0].id}/thumbnail` : '')}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3">{artist.name}</Typography>
            <Typography variant="subtitle2" sx={{marginTop: '1em'}}>
              {trackLength} {trackSuffix} • {albumLength} {albumSuffix} • {totalTime}
            </Typography>
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
              <PlayArrowIcon
                fontSize="medium"
                style={{ marginLeft: "-0.3em" }}
              />
              Play
            </Button>
          </div>
        </div>
        <Box
          sx={{
            flexDirection: "column",
            padding: 2,
            margin: 2,
            alignItems: "left",
          }}
        >
          <Typography variant="h5">Songs</Typography>
          <TrackTable
            tracks={tracks}
            handleTrackClick={handleTrackClick}
            hideArtistCol={true}
          />
        </Box>
        <Box
          sx={{
            flexDirection: "column",
            padding: 2,
            margin: 2,
            alignItems: "left",
          }}
        >
          <Typography variant="h5">Albums</Typography>
          <Grid
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "left",
              marginBottom: "5em",
            }}
          >
            {albums.map((album, index) => {
              return <AlbumCard album={album} key={index} />;
            })}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
