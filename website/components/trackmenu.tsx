import { APITrack } from "@/util/models/track";
import { AddOutlined, FavoriteBorderOutlined, FavoriteOutlined, PlaylistAddCheckOutlined, PlaylistAddOutlined, QueueMusicOutlined } from "@mui/icons-material";
import { Avatar, Dialog, Checkbox, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppStateContext } from "./appstateprovider";
import CreatePlaylistDialog from "./createPlaylistDialog";
import { APIPlaylist } from "@/util/models/playlist";
import { apiGetCollectionPlaylists, apiPostPlaylistAddTrack, apiPostPlaylistRemoveTrack } from "./apiclient";
import { useLoginStateContext } from "./loginstateprovider";

type PlaylistEntry = {
  playlist: APIPlaylist
  isInPlaylist: boolean
}

export default function TrackMenu(props: { track: APITrack, anchorEl: any, requestClose: any, handleTrackUpdate: () => void }) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const open = Boolean(props.anchorEl as HTMLElement | null);

  const isFavourite = useState(false);
  const addedToPlaylist = useState(false);

  const track = props.track;

  const [allPlaylists, setAllPlaylists] = useState([] as APIPlaylist[]);

  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);

  const handlePlaylistDialogClose = () => {
    setIsPlaylistDialogOpen(false);
  };

  const loadPlaylists = () => {
    if (!loginState.isLoggedIn) {
      return;
    }

    apiGetCollectionPlaylists(loginState.loggedInUserUuid)
      .then(res => {
        setAllPlaylists(res.data as APIPlaylist[]);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const requestReload = () => {
    loadPlaylists();
    props.handleTrackUpdate();
  };

  // load playlists when opened
  useEffect(() => {
    if (open) {
      loadPlaylists()
    }
  }, [open]);

  // determine the values of playlists to be shown in the playlist dialog
  const playlistEntries = [] as PlaylistEntry[];
  for (const playlist of allPlaylists) {

    // see if this track is in this playlist
    let isInPlaylist = false;
    for (const trackPlaylist of track.playlists) {
      if (trackPlaylist.id === playlist.id) {
        isInPlaylist = true;
      }
    }

    playlistEntries.push({
      playlist,
      isInPlaylist,
    });
  }

  // when a playlist entry is clicked
  const handlePlaylistToggle = (playlist: APIPlaylist, isInPlaylist: boolean) => {
    if (isInPlaylist) {
      apiPostPlaylistRemoveTrack(playlist.id.toString(), track.id)
        .then(() => {
          requestReload();
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      apiPostPlaylistAddTrack(playlist.id.toString(), track.id)
        .then(() => {
          requestReload();
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  // playlist selection dialog
  const playlistDialog = (
    <Dialog onClose={handlePlaylistDialogClose} open={isPlaylistDialogOpen}>
      <DialogTitle>Select playlists for {track.name}</DialogTitle>
      <List sx={{ pt: 0 }}>

        {
          playlistEntries.map((entry, index) => (
            <ListItem disableGutters key={index} onClick={() => handlePlaylistToggle(entry.playlist, entry.isInPlaylist)}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    <Checkbox checked={entry.isInPlaylist} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={entry.playlist.name} />
              </ListItemButton>
            </ListItem>
          ))
        }

        <ListItem disableGutters onClick={() => setIsCreatePlaylistDialogOpen(true)}>
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

      <CreatePlaylistDialog 
        isOpen={isCreatePlaylistDialogOpen}
        handleClose={() => setIsCreatePlaylistDialogOpen(false)} 
        alerts={[]}
        setAlerts={(alerts: any) => {}} 
        refreshPlaylists={() => {}}
      />

    </Menu>
  );
}