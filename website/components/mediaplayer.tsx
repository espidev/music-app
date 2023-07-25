'use client'

import { RepeatType } from '@/components/appstateprovider';
import { useAppStateContext } from "./appstateprovider";
import { useRef, useState, useEffect } from "react";
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
import {styled} from "@mui/system"
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';
import { CssBaseline } from '@mui/material';

const FooterPanel = styled('div')(({theme}) => ({
  padding: '1em',
  boxShadow: '10px 10px 10px 10px #aaaaaa',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgb(3,3,3)' : 'rgb(250, 250, 250)',
  backdropFilter: 'blur(3px)',
  overflow: 'hidden',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: '5em',
  zIndex: 9999,
}));

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

  const color = appState.theme === 'dark' ? 'white' : '';

  const PreviousButton = (
    <li className="media-clickable" onClick={() => appState.goToPreviousTrack()}><SkipPreviousOutlined sx={{color}} /></li>
  );

  const PlayPauseButton = (
      <li className="media-clickable" onClick={() => appState.isPlaying ? appState.pauseCurrentTrack() : appState.playCurrentTrack()}>
          {appState.isPlaying ? <PauseOutlined  sx={{color}} /> : <PlayArrowOutlined  sx={{color}} />}
      </li>
  );

  const NextButton = (
      <li className="media-clickable" onClick={() => appState.goToNextTrack()}><SkipNextOutlined  sx={{color}} /></li>
  );
  const QueueButton = (
      <li className="media-clickable"><QueueMusicOutlined  sx={{color}} /></li>
  );
  const RepeatButton = (
      <li className="media-clickable" onClick={() => appState.toggleRepeat()}>
        {
          appState.repeatType === RepeatType.OFF ? <RepeatOutlined  sx={{color}} /> :
            appState.repeatType === RepeatType.REPEAT ? <RepeatOnOutlined  sx={{color}} /> : <RepeatOneOnOutlined  sx={{color}} />
        }
      </li>
  );
  const ShuffleButton = (
      <li className="media-clickable" onClick={() => {appState.isShuffled ? appState.unshuffleQueue() : appState.shuffleQueue()}}>
          {appState.isShuffled ? <ShuffleOnOutlined  sx={{color}} /> : <ShuffleOutlined  sx={{color}} />}
      </li>
  );

  return (
    <ThemeProvider theme={appState.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <FooterPanel className='footer-panel'>
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
          className={`${appState.theme === "dark" ? "dark-mode" : ""} rhap_time`}
        />
      </FooterPanel>
    </ThemeProvider>
  );
}
