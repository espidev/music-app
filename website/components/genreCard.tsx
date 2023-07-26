import React from "react";
import { Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";
import { APIGenre } from "@/util/models/genre";


export default function ArtistCard(props: { genre: APIGenre }) {
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
        router.push(`/collection/genres/${props.genre.id}`);
      }}
      >
        
      <CardActionArea>
        <CardMedia
          component="img"
          image={`/api/artist/${props.genre.id}/thumbnail`} // FIGURE THIS OUT
          alt="artist_cover"
          sx={{ height: '10em',  objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div">
            {props.genre.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
