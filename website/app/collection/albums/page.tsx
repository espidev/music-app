'use client'

import { useEffect, useState } from "react";
import { apiGetCollectionAlbums, apiGetCollectionAlbumsSearch } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { APIAlbum } from "@/util/models/album";
import AlertComponent, { AlertEntry } from "@/components/alerts";
import { Typography, Grid, InputAdornment, TextField } from "@mui/material";
import AlbumCard from "@/components/albumCard";
import { Search } from "@mui/icons-material";


export default function CollectionAlbumsPage() {
  const loginState = useLoginStateContext();
  const router = useRouter();

  const [albums, setAlbums] = useState([] as APIAlbum[]);
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

    // load albums
    apiGetCollectionAlbums(loginState.loggedInUserUuid)
      .then((res) => {
        setAlbums(res.data as APIAlbum[]);
      })
      .catch(err => {
        setAlerts([...alerts, { severity: "error", message: "Error fetching albums, see console for details." }]);
        console.error(err);
      })
  }, [loginState]);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset if empty
    if (event.target.value === '') {
      apiGetCollectionAlbums(loginState.loggedInUserUuid)
            .then((res) => {
                setAlbums(res.data as APIAlbum[]);
            });
        return;
    }

    // Call API to search for tracks
    apiGetCollectionAlbumsSearch(loginState.loggedInUserUuid, event.target.value).then((res) => {
      setAlbums(res.data as APIAlbum[]);
    });
  }

  return (
    <Grid sx={{ position: 'absolute', width: 0.83 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />
      
      <Grid sx={{ padding: 2 }} container direction="row" justifyContent="space-between">
        <Typography variant="h6">Albums</Typography>
        <TextField id="Search" label="Search" variant="outlined" InputProps={{
          startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
          ),
        }} onChange={handleSearch}/>
      </Grid>

      <Grid sx={{
          display: "flex",
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '5em',
        }}>
        {albums.map((album, index) => {
          return <AlbumCard album={album} key={index} />;
        })}
      </Grid>
    </Grid>
  );
}
