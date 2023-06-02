'use client'

import AppHeader from '@/components/appheader';
import AppSidebar from '@/components/appsidebar';
import MediaPlayer from '@/components/mediaplayer';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { CssBaseline } from '@mui/material';

// export const metadata = {
//   title: 'Music App',
//   description: 'yeah',
// }

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
        <FluentProvider theme={teamsLightTheme}>
          <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <CssBaseline />
            <AppHeader />

            <div style={{ display: "flex", flex: "1" }}>
              <AppSidebar />
              {children}
            </div>
            
            <MediaPlayer />
          </div>
        </FluentProvider>
      </body>
    </html>
  )
}
