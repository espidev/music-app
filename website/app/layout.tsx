'use client'

import AppHeader from '@/components/appheader';
import AppSidebar from '@/components/appsidebar';
import { AppStateProvider } from '@/components/appstateprovider';
import { LoginStateProvider } from '@/components/loginstateprovider';
import MediaPlayer from '@/components/mediaplayer';
// import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
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
        {/* <ThemeProvider theme={getActiveTheme('light')}> */}
          <LoginStateProvider value={{
            isLoggedIn: false,
          }}>
            <AppStateProvider value={{
              isLoggedIn: false,
              isPlaying: false,
              currentTrackId: "",
            }}>

              <AppHeader />
              <AppSidebar />
              
              <div style={{ height: "100vh", zIndex: 1 }}>
                <CssBaseline />

                <div style={{ marginLeft: "16em", marginTop: "4.5em", marginBottom: "5em" }}>
                  {children}
                </div>
                
                <MediaPlayer />
              </div>
              
            </AppStateProvider>
          </LoginStateProvider>
        {/* </ThemeProvider> */}
        {/* </FluentProvider> */}
      </body>
    </html>
  )
}
