'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionPlaylists, apiPostCreatePlaylist } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { APIPlaylist } from "@/util/models/playlist";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { Typography, Grid, Modal, TextField, Button } from "@mui/material";
import PlaylistCard from "@/components/playlistCard";

export default function CollectionPlaylistsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [playlists, setPlaylists] = useState([] as APIPlaylist[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
  };

  const handleCreateButtonClick = async () => {
    try {
      const data = { name: newPlaylistName, description: newPlaylistDescription };
      const response = await apiPostCreatePlaylist(loginState.loggedInUserUuid, data);
      const newPlaylist = response.data;
      setPlaylists([...playlists, newPlaylist]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Handle error and show error message
    }
  };

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
    apiGetCollectionPlaylists(loginState.loggedInUserUuid)
      .then((res) => {
        setPlaylists(res.data as APIPlaylist[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching playlists, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
  return <></>;
}

  return (
    <Grid sx={{ position: 'absolute', width: 0.83 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />
            
      {/* Create Playlist Modal */}
      <Modal open={showCreateModal} onClose={handleCloseModal}>
        <div style={{ padding: '1rem', background: 'white' }}>
          <Typography variant="h6">Create New Playlist</Typography>
          <TextField
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Playlist Description"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
            Create
          </Button>
        </div>
      </Modal>

      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Playlists</Typography>

        <Button variant="contained" onClick={handleCreatePlaylist}>
          Create Playlist
        </Button>
      </Grid>

      {playlists.map((playlist) => {
        return <PlaylistCard key={playlist.id} playlist={playlist} />;
      })}
    </Grid>
  );
}
