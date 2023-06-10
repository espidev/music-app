'use client'

import AppHeader from '@/components/appheader';
import AppSidebar from '@/components/appsidebar';
import { AppStateProvider } from '@/components/appstateprovider';
import { LoginStateProvider } from '@/components/loginstateprovider';
import MediaPlayer from '@/components/mediaplayer';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { CssBaseline } from '@mui/material';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        {/* <FluentProvider theme={teamsLightTheme}> */}
        <LoginStateProvider value={{
          isLoggedIn: false,
        }}>
          <AppStateProvider value={{
            isLoggedIn: false,
            isPlaying: false,
            currentTrackId: "",
          }}>

            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
              <CssBaseline />
              <AppHeader />

              <div style={{ display: "flex", flex: "1", alignItems: "stretch" }}>
                <AppSidebar />
                <div style={{ flexGrow: "1" }}>
                  {children}
                </div>
               </div>
              
              <MediaPlayer />
            </div>
            
          </AppStateProvider>
        </LoginStateProvider>
        {/* </FluentProvider> */}
      </body>
    </html>
  )
}
