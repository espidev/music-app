import React from "react";
import { APIArtist } from "@/util/models/artist";
import { Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";


export default function ArtistCard(props: { artist: APIArtist }) {
  const router = useRouter();

  return (
    <Card sx={{ 
      maxWidth: '12em',
      zIndex: 0,
      margin: '0.5em',
      marginLeft: '0.375em',
      marginRight: '0.375em',
      backgroundColor: 'rgba(235, 250, 252, 0.5)',
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
          height="140"
          image={`/api/artist/${props.artist.id}/thumbnail`}
          alt="artist_cover"
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
