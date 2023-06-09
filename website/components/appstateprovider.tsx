'use client'

import { APIAccount } from "@/util/models/account";
import { APITrack } from "@/util/models/track";
import { getCookie } from "cookies-next";
import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useReducer, useState } from "react";

const initialState = {
  isLoggedIn: true, // will be determined by cookie
  loggedInUserUuid: '',
  loggedInUsername: '',
  isPlaying: false,
  currentTrack: null as APITrack | null,

  // dispatch
  setLoggedIn: null as any,
  setLoggedOut: null as any,
  changeTrack: null as any,
  playCurrentTrack: null as any,
  pauseCurrentTrack: null as any,
  stopCurrentTrack: null as any,
};

export const AppStateContext = createContext(initialState);

export function AppStateProvider({ children }: any) {

  // logic for obtaining the initial cookie and user information (for new page loads)
  const jwt = getCookie('token');
  const jwtValid = jwt !== undefined && jwt !== '';
  const jwtData = jwtValid ? (jwtDecode(jwt as string) as any).data : null;

  const [state, dispatch] = useReducer(AppStateReducer, {
    ...initialState,
    // fill in initial user details
    isLoggedIn: jwtValid,
    loggedInUserUuid: jwtValid ? jwtData.uuid : '',
    loggedInUsername: jwtValid ? jwtData.username : '',
  });

  const setLoggedIn = (account: APIAccount) => dispatch({type: 'login', account});
  const setLoggedOut = () => dispatch({type: 'logout'});

  const changeTrack = (track: APITrack) => dispatch({type: 'change-track', track});
  const playCurrentTrack = () => dispatch({type: 'play'});
  const pauseCurrentTrack = () => dispatch({type: 'pause'});
  const stopCurrentTrack = () => dispatch({type: 'stop'});

  return (
    <AppStateContext.Provider value={{
      isLoggedIn: state.isLoggedIn,
      loggedInUserUuid: state.loggedInUserUuid,
      loggedInUsername: state.loggedInUsername,
      isPlaying: state.isPlaying,
      currentTrack: state.currentTrack,
      setLoggedIn,
      setLoggedOut,
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
    case 'login':
      return {
        ...state,
        isLoggedIn: true,
        loggedInUserUuid: action.account.uuid,
        loggedInUsername: action.account.username,
      };
    case 'logout':
      return {
        ...state,
        isLoggedIn: false,
        loggedInUserUuid: '',
        loggedInUsername: '',
      };
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