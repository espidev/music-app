'use client'

import { Typography } from "@mui/material";
import { AppStateContext } from "./appstateprovider";
import { useContext, useRef } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function MediaPlayer() {
  const appState = useContext(AppStateContext);
  const audioRef = useRef(null);

  const streamLink = appState.currentTrack ? 
    `/api/collection/${appState.loggedInUserUuid}/tracks/${appState.currentTrack.id}/stream` : 
    '';

  return (
    <nav style={{ 
      padding: "16px", 
      background: "white", 
      boxShadow: "10px 10px 10px 10px #AAAAAA", 
      display: "flex", 
      flexDirection: "row" 
    }}>
      <div>
        <span>
          <img src={appState.currentTrack ? appState.currentTrack.thumbnail_src : ''} />
        </span>
        <div>
          <Typography>{appState.currentTrack?.name}</Typography>
          <Typography>{appState.currentTrack?.artist_name}</Typography>
        </div>
      </div>

      <AudioPlayer 
        layout={"horizontal"}
        ref={audioRef}
        src={streamLink}
        onPlay={() => appState.playCurrentTrack()}
        onPause={() => appState.pauseCurrentTrack()}
        onEnded={() => {}} // TODO
      />
    </nav>
  );
}
