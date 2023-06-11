'use client'

import { apiGetCollectionArtists } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIArtist } from "@/util/models/artist";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionArtistsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [artists, setArtists] = useState([] as APIArtist[]);

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

    // load albums
    apiGetCollectionArtists(loginState.loggedInUserUuid)
      .then(res => {
        setArtists(res.data as APIArtist[]);
      })
      .catch(err => {
        console.error(err);
        // TODO UI error popup
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  return (
    <Box sx={{ height: 1 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Artists</Typography>
      </Box>
    </Box>
  );
}