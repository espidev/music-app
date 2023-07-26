import { APITrack } from "@/util/models/track";
import { AddOutlined, FavoriteBorderOutlined, FavoriteOutlined, PlaylistAddCheckOutlined, PlaylistAddOutlined, QueueMusicOutlined } from "@mui/icons-material";
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useAppStateContext } from "./appstateprovider";

export default function TrackMenu(props: { track: APITrack, anchorEl: any, requestClose: any }) {
  const appState = useAppStateContext();
  const open = Boolean(props.anchorEl as HTMLElement | null);

  const isFavourite = useState(false);
  const addedToPlaylist = useState(false);

  const track = props.track;

  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  
  const handlePlaylistDialogClose = () => {
    setIsPlaylistDialogOpen(false);
  };

  const playlistDialog = (
    <Dialog onClose={handlePlaylistDialogClose} open={isPlaylistDialogOpen}>
      <DialogTitle>Select playlists for {track.name}</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar>
                <AddOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add playlist" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );

  return (
    <Menu
      id="positioned-menu"
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

      <MenuItem onClick={() => setIsPlaylistDialogOpen(true)}>
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

      {playlistDialog}

    </Menu>
  );
}