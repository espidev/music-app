import { APITrack } from "@/util/models/track";
import { FavoriteBorderOutlined, FavoriteOutlined, PlaylistAddCheckOutlined, PlaylistAddOutlined, QueueMusicOutlined } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useAppStateContext } from "./appstateprovider";

export default function TrackMenu(props: { track: APITrack, anchorEl: any, requestClose: any }) {
  const appState = useAppStateContext();
  const open = Boolean(props.anchorEl as HTMLElement | null);

  const isFavourite = useState(false);
  const addedToPlaylist = useState(false);

  const track = props.track;

  return (
    <Menu
      id="positioned-menu"
      aria-labelledby="positioned-button"
      anchorEl={props.anchorEl}
      open={open}
      onClose={props.requestClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      
      <MenuItem onClick={props.requestClose}>
        <ListItemIcon>
          { isFavourite ? <FavoriteOutlined /> : <FavoriteBorderOutlined /> }
        </ListItemIcon>
        <Typography variant="inherit">
          Favourite
        </Typography>
      </MenuItem>

      <MenuItem onClick={props.requestClose}>
        <ListItemIcon>
          { addedToPlaylist ? <PlaylistAddCheckOutlined /> : <PlaylistAddOutlined /> }
        </ListItemIcon>
        <Typography variant="inherit">
          Add to playlist
        </Typography>
      </MenuItem>
      
      <MenuItem onClick={() => {
        appState.playTrackNext(track);
        props.requestClose();
      }}>
        <ListItemIcon>
          <QueueMusicOutlined />
        </ListItemIcon>
        <Typography variant="inherit">
          Play next
        </Typography>
      </MenuItem>

    </Menu>
  );
}