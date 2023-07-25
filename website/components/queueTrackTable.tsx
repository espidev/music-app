import { useState, useEffect, useRef } from "react";
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
  TableSortLabel,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import React from "react";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVertOutlined,
  PlaylistAddCheckOutlined,
  PlaylistAddOutlined,
  QueueMusicOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";
import { lightTheme, darkTheme } from "./themes";
import {
  apiGetCollectionTracks,
  apiGetCollectionTracksSearch,
} from "@/components/apiclient";
import { AlertEntry } from "./alerts";
import { useLoginStateContext } from "./loginstateprovider";

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
}) {
  const router = useRouter();
  const appState = useAppStateContext();

  // Menu stuff
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const [isFavourite, setIsFavourite] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  const track = props.track;

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    track: APITrack,
    ref: any
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          onClick={(event) => handleMenuClick(event, track, anchorRef)}
          sx={{ borderRadius: "1em", padding: 0, margin: 0, width: "0.5em" }}
          id="positioned-button"
          aria-controls={open ? "positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVertOutlined
            fontSize="small"
            sx={{ color: appState.theme === "dark" ? "whitesmoke" : "#000" }}
          />
        </Button>

        <Menu
          id="positioned-menu"
          aria-labelledby="positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              {isFavourite ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
            </ListItemIcon>
            <Typography variant="inherit">Favourite</Typography>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              {addedToPlaylist ? (
                <PlaylistAddCheckOutlined />
              ) : (
                <PlaylistAddOutlined />
              )}
            </ListItemIcon>
            <Typography variant="inherit">Add to playlist</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              appState.playTrackNext(track);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <QueueMusicOutlined />
            </ListItemIcon>
            <Typography variant="inherit">Play next</Typography>
          </MenuItem>
        </Menu>
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
  const [alerts, setAlerts] = useState([] as AlertEntry[]);
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

  const strCmp = (a: string, b: string, isAsc: Boolean) => {
    return (
      (isAsc ? 1 : -1) * a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  };

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
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </ThemeProvider>
  );
}
