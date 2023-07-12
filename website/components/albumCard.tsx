import React from "react";
import { APIAlbum } from "@/util/models/album";
import { Typography, Card, CardActions, CardActionArea, CardContent, CardMedia, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


export default function AlbumCard(props: { album: APIAlbum }) {
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
        router.push(`/collection/albums/${props.album.id}`);
      }}
      >
      <CardActionArea>
        <CardMedia
          component="img"
          image={props.album.thumbnail_src}
          alt="album_cover"
          sx={{ height: '10em',  objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div">
            {props.album.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.album.album_artist}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {/* TODO once playlist functionality is available */}
        <Button size="small" color="primary">
          <PlayArrowIcon fontSize="medium" style={{ color: '#000' }} />
        </Button>
      </CardActions>
    </Card>
  );
}
