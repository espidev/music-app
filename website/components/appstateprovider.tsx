'use client'

import { APITrack } from "@/util/models/track";
import { createContext, useContext, useEffect, useReducer, useState } from "react";

export enum RepeatType {
  OFF,
  REPEAT,
  REPEAT_ONCE,
};

const initialState = {
  isPlaying: false,
  isShuffled: false,
  repeatType: RepeatType.OFF,

  currentTrack: null as APITrack | null,

  queuePosition: 0 as number,
  trackQueue: [] as APITrack[],
  originalTrackQueue: [] as APITrack[],

  // dispatch
  changeQueue: null as any,
  playTrackNext: null as any,
  playCurrentTrack: null as any,
  pauseCurrentTrack: null as any,
  stopCurrentTrack: null as any,

  goToNextTrack: null as any,
  goToPreviousTrack: null as any,
  shuffleQueue: null as any,
  unshuffleQueue: null as any,
  toggleRepeat: null as any,
};

export const AppStateContext = createContext(initialState);

export function AppStateProvider({ children }: any) {

  const [state, dispatch] = useReducer(AppStateReducer, initialState);

  const changeQueue = (queue: APITrack[], position: number) => dispatch({type: 'change-queue', queue, position});
  const playTrackNext = (track: APITrack) => dispatch({type: 'play-track-next', track});
  const playCurrentTrack = () => dispatch({type: 'play'});
  const pauseCurrentTrack = () => dispatch({type: 'pause'});
  const stopCurrentTrack = () => dispatch({type: 'stop'});

  const goToNextTrack = () => dispatch({type: 'go-to-next-track'});
  const goToPreviousTrack = () => dispatch({type: 'go-to-previous-track'});
  const shuffleQueue = () => dispatch({type: 'shuffle-queue'});
  const unshuffleQueue = () => dispatch({type: 'unshuffle-queue'});
  const toggleRepeat = () => dispatch({type: 'toggle-repeat'});

  return (
    <AppStateContext.Provider value={{
      isPlaying: state.isPlaying,
      isShuffled: state.isShuffled,
      repeatType: state.repeatType,
      currentTrack: state.currentTrack,
      queuePosition: state.queuePosition,
      trackQueue: state.trackQueue,
      originalTrackQueue: state.originalTrackQueue,
      changeQueue,
      playTrackNext,
      playCurrentTrack,
      pauseCurrentTrack,
      stopCurrentTrack,
      goToNextTrack,
      goToPreviousTrack,
      shuffleQueue,
      unshuffleQueue,
      toggleRepeat,
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
    case 'change-queue':
      return {
        ...state,
        isPlaying: false,
        isShuffled: false,
        currentTrack: (action.queue !== null && action.queue.length > 0) ? action.queue[action.position] : null,

        queuePosition: action.position,
        trackQueue: action.queue,
        originalTrackQueue: action.queue,
      };
    case 'play-track-next':
      
      let cloneQueue = [...state.trackQueue];
      cloneQueue.splice(state.queuePosition + 1, 0, action.track);

      let cloneOriginalQueue = [...state.originalTrackQueue];
      cloneOriginalQueue.splice(state.queuePosition + 1, 0, action.track);

      return {
        ...state,
        trackQueue: cloneQueue,
        originalTrackQueue: cloneOriginalQueue,
      }
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
        currentTrack: null,

        queuePosition: 0,
        trackQueue: [],
        originalTrackQueue: [],
      };
    case 'go-to-next-track':
      let newPosition = state.queuePosition + 1;

      if (state.repeatType === RepeatType.REPEAT) {
        if (newPosition >= state.trackQueue.length) {
          newPosition = 0;
        }
      } else if (state.repeatType === RepeatType.REPEAT_ONCE) {
        newPosition--;
      }

      return {
        ...state,
        isPlaying: (newPosition < state.trackQueue.length) ? state.isPlaying : false,
        currentTrack: (newPosition < state.trackQueue.length) ? state.trackQueue[newPosition] : null,

        queuePosition: newPosition,
      };
    case 'go-to-previous-track':
      const newQPosition = state.queuePosition - 1;
      return {
        ...state,
        isPlaying: (newQPosition >= 0) ? state.isPlaying : false,
        currentTrack: (newQPosition >= 0) ? state.trackQueue[newQPosition] : null,

        queuePosition: newQPosition,
      };
    case 'shuffle-queue':
      const queueClone = [...state.originalTrackQueue];
      shuffleArray(state.queuePosition, queueClone);
      return {
        ...state,
        isShuffled: true,
        trackQueue: queueClone,
      };
    case 'unshuffle-queue':
      return {
        ...state,
        isShuffled: false,
        trackQueue: state.originalTrackQueue,
      }; // TODO update position of track is in new queue???
    case 'toggle-repeat':
      return {
        ...state,
        repeatType: (state.repeatType === RepeatType.OFF) ? RepeatType.REPEAT : ((state.repeatType === RepeatType.REPEAT) ? RepeatType.REPEAT_ONCE : RepeatType.OFF)
      };
  }
}

function shuffleArray(startIndex: number, array: any[]) {
  for (let i = array.length - 1; i > (startIndex + 1); i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
