import { createContext, useContext } from "react";

const Context = createContext({
  isLoggedIn: false,
  isPlaying: false,
  currentTrackId: "",
});

export function AppStateProvider() {

}

export function useAppStateContext() {
  return useContext(Context);
}
