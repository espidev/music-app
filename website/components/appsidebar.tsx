'use client'

import { AlbumOutlined, FolderOutlined, MusicNoteOutlined, PersonOutlineOutlined, QueueMusicOutlined, UploadFileOutlined } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {theme} = useAppStateContext();

  const color = theme === 'dark' ? 'white' : 'rgb(50, 50, 50)';

  const sidebar_button = {
    borderRadius: "10px !important",
    marginBottom: "0.375em",
    color: color
  };

  return (
    <div style={{
      height: "100%",
      width: "16em",
      backgroundColor: theme === 'dark' ? 'rgb(3,3,3)' : 'rgb(250, 250, 250)',
      position: "fixed",
      top: "4.3em",
      left: 0,
      padding: "1em",
      zIndex: 1,
      borderRightColor: "rgba(230, 230, 230)",
      borderRightWidth: "thin",
      borderRightStyle: "solid",
    }}>
      <ListItemButton 
        style={sidebar_button}
        selected={pathname === '/collection'} 
        onClick={() => router.push(`/collection`)}
      >
        <ListItemIcon><MusicNoteOutlined style={{color: color}}/></ListItemIcon>
        <ListItemText primary="Tracks" />
      </ListItemButton>

      <ListItemButton 
        style={sidebar_button}
        selected={pathname === '/collection/albums'}
        onClick={() => router.push(`/collection/albums`)}
      >
        <ListItemIcon><AlbumOutlined style={{color: color}} /></ListItemIcon>
        <ListItemText primary="Albums" />
      </ListItemButton>

      <ListItemButton 
        style={sidebar_button}
        selected={pathname === '/collection/artists'}
        onClick={() => router.push(`/collection/artists`)}
      >
        <ListItemIcon><PersonOutlineOutlined style={{color: color}}/></ListItemIcon>
        <ListItemText primary="Artists" />
      </ListItemButton>

      <ListItemButton
        style={sidebar_button}
        selected={pathname === '/collection/genres'}
        onClick={() => router.push(`/collection/genres`)}
      >
        <ListItemIcon><FolderOutlined style={{color: color}} /></ListItemIcon>
        <ListItemText primary="Genres" />
      </ListItemButton>

      <ListItemButton 
        style={sidebar_button}
        selected={pathname === '/collection/playlists'}
        onClick={() => router.push(`/collection/playlists`)}
      >
        <ListItemIcon><QueueMusicOutlined style={{color: color}} /></ListItemIcon>
        <ListItemText primary="Playlists" />
      </ListItemButton>

      <ListItemButton 
        style={sidebar_button}
        selected={pathname === '/collection/upload'}
        onClick={() => router.push(`/collection/upload`)}
      >
        <ListItemIcon><UploadFileOutlined style={{color: color}} /></ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItemButton>
    </div>
  );
}
