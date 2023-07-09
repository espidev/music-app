'use client'

import AlertComponent, { AlertEntry } from "@/components/alerts";
import { apiGetCollectionAlbums } from "@/components/apiclient";
import { useLoginStateContext } from "@/components/loginstateprovider";
import { APIAlbum } from "@/util/models/album";
import { APIArtist } from "@/util/models/artist";
import { Box, Typography, Card, CardActions, CardContent, CardMedia, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from '@mui/system';

// The album card component

const CardContainer = styled('div')({
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  padding: '16px',
  width: '300px',
});

function AlbumCard(props: { album: APIAlbum }) {
  return (
    <Card sx={{
        zIndex: 100,
        width: '10vw',
        margin: '0.5em',
        marginX: '0.75em',
        backgroundColor: 'rgba(235,250,252,0.5)',
        "&:hover": {
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
        },
        transition: 'all 0.2s ease-in-out',
      }}>
      <CardMedia
        component="img"
        alt="album_cover"
        height="140"
        image={props.album.thumbnail_src}
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle2" component="div">
          {props.album.name}
        </Typography>

        <Typography gutterBottom variant="caption" component="div">
          bruh {props.album.artists.name}
        </Typography>

        {/* <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );

  // return (
  //   <CardContainer>
  //     {/* Card content */}
  //     <h2>Title</h2>
  //     <p>Content goes here</p>
  //   </CardContainer>
  // );

  // return (
  //   <Box
  //     sx={{
  //       borderRadius: '4px',
  //       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  //       // padding: '16px',
  //       width: '10vw',
  //       margin: '0.5em',
  //       marginX: '0.75em',
  //       backgroundColor: 'rgba(235,250,252,0.5)',
  //       "&:hover": {
  //         backgroundColor: 'rgba(25, 118, 210, 0.1)',
  //       },
  //       transition: 'all 0.2s ease-in-out',
  //     }}
  //   >
  //     <img width="100%" src={props.album.thumbnail_src} alt="album_cover" />
  //     <div className={"bg-red-300"}>
  //       <h4>{props.album.name}</h4>
  //       <h5>bruh{props.album.artists.name}</h5>
  //     </div>
  //   </Box>
  // );
}

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

  // console.log(albums);

  return (
    <Box sx={{
      height: '100%',
      position: 'absolute',
      // zIndex:-1,
      // backgroundColor: 'pink'
      }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />
      
      <Box sx={{ padding: 2, zIndex: -1 }}>
        <Typography variant="h6">Albums</Typography>
      </Box>

      <Box sx={{
          display: "flex",
          flexWrap: 'wrap',
          justifyContent: 'center',
          // backgroundColor: 'red'
        }}>
        {albums.map((album) => {
          return <AlbumCard album={album} key={album.id} />;
        })}
      </Box>
    </Box>
  );
}