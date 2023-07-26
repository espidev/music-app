'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionPlaylists, apiPostCreatePlaylist } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { APIPlaylist } from "@/util/models/playlist";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { Typography, Grid, Modal, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PlaylistCard from "@/components/playlistCard";

export default function CollectionPlaylistsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [playlists, setPlaylists] = useState([] as APIPlaylist[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const loadPlaylists = () => {
    apiGetCollectionPlaylists(loginState.loggedInUserUuid)
      .then((res) => {
        setPlaylists(res.data as APIPlaylist[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching playlists, see console for details." }]);
        console.error(err);
      });
  }

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

    // load playlists
    loadPlaylists();

  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleCreatePlaylist = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewPlaylistName('');
  };

  const handleCreateButtonClick = async () => {
    try {
      await apiPostCreatePlaylist(loginState.loggedInUserUuid, newPlaylistName);
      loadPlaylists();
      handleCloseModal();
    } catch (error) {
      setAlerts([...alerts, { severity: "error", message: "Error creating playlist, see console for details." }]);
      console.error('Error creating playlist:', error);
    }
  };

  // create playlist dialog
  const createPlaylistDialog = (
    <Dialog open={showCreateModal} onClose={handleCloseModal}>
      <DialogTitle>Create New Playlist</DialogTitle>
      <DialogContent>
      <TextField
          label="Playlist Name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          fullWidth
          autoFocus
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button onClick={handleCreateButtonClick}>Create</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Grid sx={{ position: 'absolute', width: 0.83 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      {createPlaylistDialog}

      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Playlists</Typography>

        <Button variant="outlined" onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
      </Grid>

      {playlists.map((playlist) => {
        return <PlaylistCard key={playlist.id} playlist={playlist} />;
      })}
    </Grid>
  );
}
