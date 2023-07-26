import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useLoginStateContext } from "./loginstateprovider";
import { apiPostCreatePlaylist } from "./apiclient";

export default function CreatePlaylistDialog(props: { isOpen: boolean, handleClose: any, alerts: any, setAlerts: any, refreshPlaylists: any }) {
  const loginState = useLoginStateContext();

  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreateButtonClick = async () => {
    try {
      await apiPostCreatePlaylist(loginState.loggedInUserUuid, newPlaylistName);
      props.refreshPlaylists();
      props.handleClose();
    } catch (error) {
      props.setAlerts([...props.alerts, { severity: "error", message: "Error creating playlist, see console for details." }]);
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
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
        <Button onClick={() => { setNewPlaylistName(''); props.handleClose(); }}>Cancel</Button>
        <Button onClick={handleCreateButtonClick}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}