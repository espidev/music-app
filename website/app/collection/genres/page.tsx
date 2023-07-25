'use client'
'use client'

import AlertComponent, { AlertEntry } from "@/components/alerts";
import { apiGetCollectionGenres } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIGenre } from "@/util/models/genre";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArtistCard from "@/components/artistCard";

export default function CollectionGenresPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [genres, setGenres] = useState([] as APIGenre[]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

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

    // load genres
    apiGetCollectionGenres(loginState.loggedInUserUuid)
      .then(res => {
        setGenres(res.data as APIGenre[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching genres, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  return (
    <Box sx={{ position: 'absolute', }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Genres</Typography>
      </Box>

      <Grid container spacing={2} sx={{ padding: 2, display: "flex",
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '4em', }}>
        {genres.map((genre) => (
          <ArtistCard key={genre.id} artist={genre} />
        ))}
      </Grid>
    </Box>
  );
}