"use client";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIGenre } from "@/util/models/genre";
import { APIAlbum } from "@/util/models/album";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertEntry } from "@/components/alerts";
import {
  apiGetGenre,
  apiGetGenreTracks,
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

export default function CollectionGenrePage({
  params,
}: {
  params: { genreId: string };
}) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const genreId = params.genreId;

  const [genre, setGenre] = useState<APIGenre>();
  const [tracks, setTracks] = useState([] as APITrack[]);
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

    // load genre content
    apiGetGenre(genreId)
      .then((res) => {
        console.log(res.data);
        setGenre(res.data as APIGenre);

        // Fetch and set the tracks
        apiGetGenreTracks(genreId).then((res_tracks) => {
          setTracks(res_tracks.data as APITrack[]);
        });
      })
      .catch((err) => {
        setAlerts([
          ...alerts,
          {
            severity: "error",
            message: "Error fetching genres, see console for details.",
          },
        ]);
        console.error(err);
      });
    // load albums
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  if (!genre) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeTrack(track);
  };

  const totalTime = formatDuration(
    tracks.reduce((acc, track) => acc + track.audio_length, 0)
  );
  const trackLength = tracks.length;
  const suffix = trackLength === 1 ? "song" : "songs";

  return (
    <div>
      <Box>
        <div
          style={{
            display: "flex",
            // backgroundColor: 'pink',
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
            src={`/api/genre/${genreId}/thumbnail`}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h3">{genre.name}</Typography>
            <Typography variant="subtitle2" sx={{marginTop: '1em'}}>
              {trackLength} {suffix} • {totalTime}
            </Typography>
            <Button
              variant="outlined"
              style={{ width: "5vw", marginTop: "2em", color: "black" }}
            >
              <PlayArrowIcon
                fontSize="medium"
                style={{ color: "#000", marginLeft: "-0.3em" }}
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
            hideGenreCol={true}
          />
        </Box>
      </Box>
    </div>
  );
}
