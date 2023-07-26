import { useState, useEffect } from "react";
import format from "format-duration";
import { APITrack } from "@/util/models/track";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import React from "react";
import {
  MoreVertOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";
import { lightTheme, darkTheme } from "./themes";
import { useLoginStateContext } from "./loginstateprovider";
import TrackMenu from "./trackmenu";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  padding: 0,
  margin: 0,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    transition: "all 0.2s ease-in-out",
  },
  cursor: "pointer",
  color: theme.palette.text.primary,
}));

function QueueTrackTableRow(props: {
  track: APITrack;
  handleTrackClick: (track: APITrack) => void;
  ranking: number;
  handleTrackUpdate: () => void;
}) {
  const router = useRouter();
  const appState = useAppStateContext();

  // Menu stuff
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const track = props.track;

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <StyledTableRow>
      <TableCell>
        {appState.currentTrack &&
        track.id === appState.currentTrack.id &&
        appState.queuePosition === props.ranking - 1 ? (
          <b style={{ color: "#01579B" }}>{props.ranking}</b>
        ) : (
          props.ranking
        )}
      </TableCell>

      <TableCell className="trackListPictureCell" sx={{ padding: 0 }}>
        <Grid
          sx={{
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <LazyLoadImage
            className="trackImage"
            src={track.thumbnail_src}
            alt={track.name}
            style={{ height: "3em" }}
          />
        </Grid>
      </TableCell>

      <TableCell onClick={() => props.handleTrackClick(track)}>
        {
          <div>
            <div>
              {appState.currentTrack &&
              track.id === appState.currentTrack.id &&
              appState.queuePosition === props.ranking - 1 ? (
                <b style={{ color: "#01579B" }}>{track.name}</b>
              ) : (
                track.name
              )}
            </div>
            <Typography variant="caption" color="text.secondary">
              {track.artist_name}
            </Typography>
          </div>
        }
      </TableCell>

      <TableCell
        onClick={() => {
          router.push(`/collection/albums/${track.albums[0].id}`);
        }}
      >
        <div style={{ textOverflow: "ellipsis" }}>
          {track.albums.length > 0 ? track.albums[0].name : ""}
        </div>
      </TableCell>

      <TableCell>{format(track.audio_length * 1000)}</TableCell>

      <TableCell onClick={() => {}}>
        <Button
          onClick={(event) => handleMenuClick(event)}
          sx={{ borderRadius: "1em", padding: 0, margin: 0, width: "0.5em" }}
          id="positioned-button"
        >
          <MoreVertOutlined
            fontSize="small"
            sx={{ color: appState.theme === "dark" ? "whitesmoke" : "#000" }}
          />
        </Button>

        <TrackMenu 
          track={track} 
          anchorEl={menuAnchorEl} 
          requestClose={handleMenuClose}
          handleTrackUpdate={props.handleTrackUpdate}
        />

      </TableCell>
    </StyledTableRow>
  );
}

export default function QueueTrackTable() {
  const appState = useAppStateContext();
  const theme = appState.theme;
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [tracks, setTracks] = useState([] as APITrack[]);
  const [sortedData, setSortedData] = useState(tracks);

  // Is login state checking required here? I don't think so.
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

    // load tracks
    if (appState.trackQueue) {
      setTracks(appState.trackQueue);
    }
  }, [loginState, appState.trackQueue]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }
  const handleTrackClick = (track: APITrack) => {
    appState.changeQueue(tracks, tracks.indexOf(track));
    appState.playCurrentTrack();
  };

  // This is required because at first, props.tracks is an empty array
  useEffect(() => {
    setSortedData(tracks);
  }, [tracks]);

  const color = theme === "dark" ? "white" : "rgb(50, 50, 50)";

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Grid
        sx={{
          width: "100%",
          height: "100%",
          paddingBottom: "2em",
          overflow: "scroll",
          color: color,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="upNextTitle" colSpan={6}>
                Queue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((track, index) => (
              <QueueTrackTableRow
                key={index}
                track={track}
                handleTrackClick={handleTrackClick}
                ranking={index + 1}
                handleTrackUpdate={() => {}}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </ThemeProvider>
  );
}
