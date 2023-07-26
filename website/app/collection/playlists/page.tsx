'use client'

import { use, useEffect, useState } from "react";
import { apiGetCollectionPlaylists, apiPostCreatePlaylist } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { APIPlaylist } from "@/util/models/playlist";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { Typography, Grid, Modal, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PlaylistCard from "@/components/playlistCard";
import CreatePlaylistDialog from "@/components/createPlaylistDialog";
import { useAppStateContext } from "@/components/appstateprovider";

export default function CollectionPlaylistsPage() {
  const loginState = useLoginStateContext();
  const appState = useAppStateContext();
  const router = useRouter();

  const [playlists, setPlaylists] = useState([] as APIPlaylist[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const [showCreateModal, setShowCreateModal] = useState(false);

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
  };

  return (
    <Grid sx={{ position: 'absolute', width: 0.83 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      <CreatePlaylistDialog 
        isOpen={showCreateModal} 
        handleClose={handleCloseModal} 
        alerts={alerts} 
        setAlerts={setAlerts} 
        refreshPlaylists={loadPlaylists}
      />

      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Playlists</Typography>

        <Button variant="outlined" onClick={handleCreatePlaylist}
          sx={{
            color: appState.theme === "dark" ? "white" : "",
            borderColor: appState.theme === "dark" ? "white" : ""}}>
          Create Playlist
        </Button>
      </Grid>

      <Grid sx={{
          display: "flex",
          flexWrap: 'wrap',
          justifyContent: 'start',
          marginBottom: '5em',
          padding: 2
        }}>
        {
          playlists.map((playlist, index) => {
            return <PlaylistCard key={index} playlist={playlist} />;
          })
        }
      </Grid>
    </Grid>
  );
}
