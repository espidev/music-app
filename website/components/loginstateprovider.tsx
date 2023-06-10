'use client'

import { APIAccount } from "@/util/models/account";
import { getCookie, setCookie } from "cookies-next";
import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  loggedInStateValid: false,
  isLoggedIn: false, // will be determined by cookie
  loggedInUserUuid: '',
  loggedInUsername: '',

  // dispatch
  setLoggedIn: null as any,
  setLoggedOut: null as any,
};

export const LoginStateContext = createContext(initialState);

export function LoginStateProvider({ children }: any) {

  const [state, dispatch] = useReducer(LoginStateReducer, initialState);

  const setLoggedIn = (account: APIAccount) => dispatch({type: 'login', account});
  const setLoggedOut = () => dispatch({type: 'logout'});

  useEffect(() => {
    // logic for obtaining the initial cookie and user information (for new page loads)
    const jwt = getCookie('token');
    const jwtValid = jwt !== undefined && jwt !== '';
    const jwtData = jwtValid ? (jwtDecode(jwt as string) as any).data : null;

    if (jwtValid) {
      setLoggedIn(jwtData);
    } else {
      setLoggedOut();
    }
  }, []);

  return (
    <LoginStateContext.Provider value={{
      loggedInStateValid: state?.loggedInStateValid || initialState.loggedInStateValid,
      isLoggedIn: state?.isLoggedIn || initialState.isLoggedIn,
      loggedInUserUuid: state?.loggedInUserUuid || initialState.loggedInUserUuid,
      loggedInUsername: state?.loggedInUsername || initialState.loggedInUsername,
      setLoggedIn,
      setLoggedOut,
    }}>
      {children}
    </LoginStateContext.Provider>
  );
}

export function useLoginStateContext() {
  return useContext(LoginStateContext);
}

export default function LoginStateReducer(state: any, action: any) {
  switch (action.type) {
    case 'login':
      return {
        loggedInStateValid: true,
        isLoggedIn: true,
        loggedInUserUuid: action.account?.uuid,
        loggedInUsername: action.account?.username,
      };
    case 'logout':
      setCookie('token', '');
      return {
        loggedInStateValid: true,
        isLoggedIn: false,
        loggedInUserUuid: '',
        loggedInUsername: '',
      };
  }
}