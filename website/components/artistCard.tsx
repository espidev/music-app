import React from "react";
import { APIArtist } from "@/util/models/artist";
import { Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";


export default function ArtistCard(props: { artist: APIArtist }) {
  const router = useRouter();
  const {theme} = useAppStateContext();

  return (
    <Card sx={{ 
      width: '12em',
      zIndex: 0,
      margin: '0.5em',
      marginLeft: '0.375em',
      marginRight: '0.375em',
      backgroundColor: theme === "dark" ? 'rgba(220, 220, 255, 0.9)' : 'rgba(235, 250, 252, 0.5)',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5em',
      }}
      onClick={() => {
        router.push(`/collection/artists/${props.artist.id}`);
      }}
      >
        
      <CardActionArea>
        <CardMedia
          component="img"
          image={`/api/artist/${props.artist.id}/thumbnail`}
          alt="artist_cover"
          sx={{ height: '10em',  objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div">
            {props.artist.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
