'use client'

import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIPlaylist } from '@/util/models/playlist';
import { Box, Typography, Button, TextField, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertEntry } from "@/components/alerts";
import { apiGetPlaylist, apiGetPlaylistTracks, apiPostCreatePlaylist } from "@/components/apiclient";
import { APITrack } from "@/util/models/track";
import TrackTable from "@/components/trackTable";
import { useAppStateContext } from "@/components/appstateprovider";

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

export default function CollectionPlaylistPage({params} : {params: {playlistId: string}}) {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const playlistId = params.playlistId;

  const [playlists, setPlaylists] = useState<APIPlaylist[]>([]);
  const [playlist, setPlaylist] = useState<APIPlaylist>();
  const [tracks, setTracks] = useState([] as APITrack[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

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

    // load playlist content
    apiGetPlaylist(playlistId)
      .then(res => {
          setPlaylist(res.data as APIPlaylist);

          // Fetch and set the tracks
          apiGetPlaylistTracks(playlistId).then(res_tracks => {
            setTracks(res_tracks.data as APITrack[]);
          })
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching playlist, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  if (!playlist) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeQueue(tracks, tracks.indexOf(track));
    appState.playCurrentTrack();
  }

  const totalTime = tracks.reduce((acc, track) => acc + track.audio_length, 0);

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
      const response = await apiPostCreatePlaylist(playlistId, data);
      const newPlaylist = response.data;
      setPlaylists([...playlists, newPlaylist]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Handle error and show error message
    }
  };

  return (
    <div>
      <Box>
        <div style={
          {
            display: 'flex',
            margin: 'auto',
            alignItems: 'center',
            zIndex: 2,
          }
        }>
          <div style={{ display: 'flex', flexDirection: "column"}}>
            <Typography variant="h3">{playlist.name}</Typography>
            <Typography variant="subtitle2" sx={{marginTop: '1em'}}>
              {tracks.length} songs • Total duration: {formatDuration(totalTime)}
            </Typography>
          </div>
          <Button variant="contained" onClick={handleCreatePlaylist}>
            Create Playlist
          </Button>
        </div>

        <TrackTable tracks={tracks} handleTrackClick={handleTrackClick} />
      </Box>

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
    </div>
  );
}
