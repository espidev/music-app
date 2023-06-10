'use client'

import { APITrack } from "@/util/models/track";
import { createContext, useContext, useEffect, useReducer, useState } from "react";

const initialState = {
  isPlaying: false,
  currentTrack: null as APITrack | null,

  // dispatch
  changeTrack: null as any,
  playCurrentTrack: null as any,
  pauseCurrentTrack: null as any,
  stopCurrentTrack: null as any,
};

export const AppStateContext = createContext(initialState);

export function AppStateProvider({ children }: any) {

  const [state, dispatch] = useReducer(AppStateReducer, initialState);

  const changeTrack = (track: APITrack) => dispatch({type: 'change-track', track});
  const playCurrentTrack = () => dispatch({type: 'play'});
  const pauseCurrentTrack = () => dispatch({type: 'pause'});
  const stopCurrentTrack = () => dispatch({type: 'stop'});

  return (
    <AppStateContext.Provider value={{
      isPlaying: state.isPlaying,
      currentTrack: state.currentTrack,
      changeTrack,
      playCurrentTrack,
      pauseCurrentTrack,
      stopCurrentTrack,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppStateContext() {
  return useContext(AppStateContext);
}

export default function AppStateReducer(state: any, action: any) {
  switch (action.type) {
    case 'change-track':
      return {
        ...state,
        currentTrack: action.track,
      };
    case 'play':
      return {
        ...state,
        isPlaying: true,
      };
    case 'pause':
      return {
        ...state,
        isPlaying: false,
      };
    case 'stop':
      return {
        ...state,
        isPlaying: false,
        currentTrackId: "",
      }
  }
}