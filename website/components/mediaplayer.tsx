'use client'

import { RepeatType } from '@/components/appstateprovider';
import { AppStateContext, useAppStateContext } from "./appstateprovider";
import { useContext, useRef, useState, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';

import '@/components/mediaplayer.css';
import { 
  PauseOutlined, 
  RepeatOutlined, 
  PlayArrowOutlined, 
  ShuffleOnOutlined, 
  ShuffleOutlined, 
  SkipNextOutlined, 
  SkipPreviousOutlined, 
  QueueMusicOutlined, 
  RepeatOn,
  RepeatOneOn,
  RepeatOnOutlined,
  RepeatOneOnOutlined
} from "@mui/icons-material";
import { useLoginStateContext } from "./loginstateprovider";

export default function MediaPlayer() {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const audioRef = useRef(null);

  const [audioIsPlaying, setAudioIsPlaying] = useState(false);

  const streamLink = appState.currentTrack ? 
    `/api/track/${appState.currentTrack.id}/stream` : 
    '';

  // update audio player to match app state
  useEffect(() => {
    if (!loginState.loggedInStateValid || !loginState.isLoggedIn) {
      return;
    }

    if (audioIsPlaying) {
    
      if (!appState.isPlaying) {
        if (audioRef.current) {
          (audioRef.current as any).audio.current.pause();
          setAudioIsPlaying(false);
        }
      }
  
    } else {
      
      if (appState.isPlaying) {
        if (audioRef.current) {
          setAudioIsPlaying(true);
  
          (audioRef.current as any).audio.current.play()
            .catch((e: any) => {
              console.log(e);
              setAudioIsPlaying(false);
              appState.pauseCurrentTrack();
            });
        }
      }
  
    }
  }, [appState, loginState, audioIsPlaying]);

  if (!loginState.isLoggedIn) {
    return <></>;
  }

  const PreviousButton = (
    <li className="media-clickable" onClick={() => appState.goToPreviousTrack()}><SkipPreviousOutlined /></li>
  );

  const PlayPauseButton = (
      <li className="media-clickable" onClick={() => appState.isPlaying ? appState.pauseCurrentTrack() : appState.playCurrentTrack()}>
          {appState.isPlaying ? <PauseOutlined /> : <PlayArrowOutlined />}
      </li>
  );

  const NextButton = (
      <li className="media-clickable" onClick={() => appState.goToNextTrack()}><SkipNextOutlined /></li>
  );
  const QueueButton = (
      <li className="media-clickable"><QueueMusicOutlined /></li>
  );
  const RepeatButton = (
      <li className="media-clickable" onClick={() => appState.toggleRepeat()}>
        {
          appState.repeatType === RepeatType.OFF ? <RepeatOutlined /> :
            appState.repeatType === RepeatType.REPEAT ? <RepeatOnOutlined /> : <RepeatOneOnOutlined />
        }
      </li>
  );
  const ShuffleButton = (
      <li className="media-clickable" onClick={() => {appState.isShuffled ? appState.unshuffleQueue() : appState.shuffleQueue()}}>
          {appState.isShuffled ? <ShuffleOnOutlined /> : <ShuffleOutlined />}
      </li>
  );

  return (
    <nav className="footer-panel">
      <div className="left-side">
        <span className="track-image-span">
          <img
            className="track-image"
            src={appState.currentTrack ? appState.currentTrack.thumbnail_src : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Stylized_uwu_emoticon.svg/2880px-Stylized_uwu_emoticon.svg.png'} 
          />
        </span>

        <div className="track-info">
          <div className="track-title">{appState.currentTrack ? appState.currentTrack.name : 'No track selected'}</div>
          <div className="track-artist">{appState.currentTrack?.artist_name}</div>
        </div>
      </div>

      <AudioPlayer 
        layout={"horizontal"}
        ref={audioRef}
        src={streamLink}
        onPlay={() => appState.playCurrentTrack()}
        onPause={() => appState.pauseCurrentTrack()}
        onEnded={() => appState.goToNextTrack()}
        customControlsSection={[PreviousButton, PlayPauseButton, NextButton, QueueButton, RepeatButton, ShuffleButton]}
      />
    </nav>
  );
}
