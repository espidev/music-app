'use client'

import { AlbumOutlined, FolderOutlined, MusicNoteOutlined, PersonOutlineOutlined, QueueMusicOutlined, UploadFileOutlined } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import '@/components/appsidebar.css'
import { usePathname, useRouter } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <ListItemButton 
        className="sidebar-button" 
        selected={pathname === '/collection'} 
        onClick={() => router.push(`/collection`)}
      >
        <ListItemIcon><MusicNoteOutlined /></ListItemIcon>
        <ListItemText primary="Tracks" />
      </ListItemButton>

      <ListItemButton 
        className="sidebar-button"
        selected={pathname === '/collection/albums'}
        onClick={() => router.push(`/collection/albums`)}
      >
        <ListItemIcon><AlbumOutlined /></ListItemIcon>
        <ListItemText primary="Albums" />
      </ListItemButton>

      <ListItemButton 
        className="sidebar-button"
        selected={pathname === '/collection/artists'}
        onClick={() => router.push(`/collection/artists`)}
      >
        <ListItemIcon><PersonOutlineOutlined /></ListItemIcon>
        <ListItemText primary="Artists" />
      </ListItemButton>

      <ListItemButton
        className="sidebar-button"
        selected={pathname === '/collection/genres'}
        onClick={() => router.push(`/collection/genres`)}
      >
        <ListItemIcon><FolderOutlined /></ListItemIcon>
        <ListItemText primary="Genres" />
      </ListItemButton>

      <ListItemButton 
        className="sidebar-button"
        selected={pathname === '/collection/playlists'}
        onClick={() => router.push(`/collection/playlists`)}
      >
        <ListItemIcon><QueueMusicOutlined /></ListItemIcon>
        <ListItemText primary="Playlists" />
      </ListItemButton>

      <ListItemButton 
        className="sidebar-button"
        selected={pathname === '/collection/upload'}
        onClick={() => router.push(`/collection/upload`)}
      >
        <ListItemIcon><UploadFileOutlined /></ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItemButton>
    </div>
  );
}