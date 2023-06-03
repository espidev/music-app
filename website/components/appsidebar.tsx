'use client'
import { AlbumOutlined, FolderOutlined, MusicNoteOutlined, PersonOutlineOutlined, QueueMusicOutlined, UploadFileOutlined } from "@mui/icons-material";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

export default function AppSidebar() {
  return (
    <Sidebar>
      <Menu>

        <MenuItem icon={ <MusicNoteOutlined /> }>
          Tracks
        </MenuItem>

        <MenuItem icon={ <AlbumOutlined /> }>
          Albums
        </MenuItem>

        <MenuItem icon={ <PersonOutlineOutlined /> }>
          Artists
        </MenuItem>

        <MenuItem icon={ <FolderOutlined /> }>
          Genres
        </MenuItem>

        <MenuItem icon={ <QueueMusicOutlined /> }>
          Playlists
        </MenuItem>

        <MenuItem icon={ <UploadFileOutlined /> }>
          Upload
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}