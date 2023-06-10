'use client'

import { apiGetCollectionTracks } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import format from 'format-duration';

import '@/components/tracktable.css';
import { useLoginStateContext } from "@/components/loginstateprovider";

export default function CollectionPage() {
  const appState = useAppStateContext();
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [tracks, setTracks] = useState([] as APITrack[]);

  useEffect(() => {
    // wait for credentials to be loaded
    if (!loginState.loggedInStateValid) {
      return;
    }

    // if not logged in, go to login page
    if (!loginState.isLoggedIn) {
      router.push('/login');
      return;
    }

    // load tracks
    apiGetCollectionTracks(loginState.loggedInUserUuid)
      .then((res) => {
        setTracks(res.data as APITrack[]);
      })
      .catch(err => {
        console.error(err);
        // TODO UI error popup
      });
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleTrackClick = (track: APITrack) => {
    appState.changeTrack(track);
  };

  return (
    <Box sx={{ height: 1 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Tracks</Typography>
      </Box>

      <table className="trackTable">
        <thead>
          <tr>
            <th className="trackListPictureCell" />
            <th className="trackListNameCell">Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>

          {
            tracks.map((track, index) => (
              <tr key={index}>
                <td className="trackListPictureCell">
                  <img className="trackImage" src={track.thumbnail_src} />
                </td>
                <td onClick={() => handleTrackClick(track)}>{track.name}</td>
                <td>{track.artist_name}</td>
                <td>{track.albums.length > 0 ? track.albums[0].name : ''}</td>
                <td>{track.create_year}</td>
                <td>{track.genres.length > 0 ? track.genres[0].name : ''}</td>
                <td>{format(track.audio_length * 1000 )}</td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </Box>
  );
}