import { useState, useEffect, useRef } from "react";
import format from 'format-duration';
import { APITrack } from "@/util/models/track";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Button, Menu, MenuItem } from '@mui/material';
import {styled} from '@mui/system';
import React from "react";
import { FavoriteBorderOutlined, FavoriteOutlined, MoreVertOutlined, PlaylistAddCheckOutlined, PlaylistAddOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";

const StyledTableRow = styled(TableRow)(
  ({theme}) => ({
      padding: 0,
      margin: 0,
      "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease-in-out"},
      cursor: "pointer",
  })
);

function TrackTableRow(props: { track: APITrack, handleTrackClick: (track: APITrack) => void, hideArtistCol?: boolean }) {
  const router = useRouter();
  const appState = useAppStateContext();
  
  // Menu stuff
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const [isFavourite, setIsFavourite] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  
  const track = props.track;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, track: APITrack, ref: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledTableRow>

      <TableCell className="trackListPictureCell" sx={{ padding: 0 }}>

        <Grid
          sx={{
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <LazyLoadImage
            className="trackImage"
            src={track.thumbnail_src}
            alt={track.name}
            style={{ height: '3em'}}
          />
        </Grid>
      
      </TableCell>
      
      <TableCell onClick={() => props.handleTrackClick(track)}>
        { 
          (appState.currentTrack && track.id === appState.currentTrack.id) ? <b style={{color: "#01579B"}}>{track.name}</b> : track.name 
        }
      </TableCell>
      
      {
        !props.hideArtistCol ? <TableCell onClick={() => { router.push(`/collection/artists/${track.artists[0].id}`) }}>{track.artist_name}</TableCell> : <></>
      }
      
      <TableCell onClick={() => { router.push(`/collection/albums/${track.albums[0].id}`); }}>
        {track.albums.length > 0 ? track.albums[0].name : ''}
      </TableCell>

      <TableCell>{track.create_year}</TableCell>

      {/* TODO: onClick for genre */}

      <TableCell>{track.genres.length > 0 ? track.genres[0].name : ''}</TableCell>

      <TableCell>{format(track.audio_length * 1000)}</TableCell>

      <TableCell onClick={() => {}}>
        <Button
          onClick={(event) => handleMenuClick(event, track, anchorRef)}
          sx={{ borderRadius: '1em', padding: 0, margin: 0, width: "0.5em" }}
          id="positioned-button"
          aria-controls={open ? 'positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertOutlined fontSize="small" sx={{color: "#000"}}/>
        </Button>

        <Menu
            id="positioned-menu"
            aria-labelledby="positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              {isFavourite ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
              Favourite
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              {addedToPlaylist ? <PlaylistAddCheckOutlined /> : <PlaylistAddOutlined />}
              Add to playlist
            </MenuItem>
          </Menu>
      </TableCell>
    </StyledTableRow>
  );
}

export default function TrackTable(props: { tracks: APITrack[], handleTrackClick: (track: APITrack) => void, hideArtistCol?: boolean }) {
  const router = useRouter();
  const appState = useAppStateContext();
  const [sortedData, setSortedData] = useState(props.tracks);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('id');

  // Is login state checking required here? I don't think so.

  // This is required because at first, props.tracks is an empty array
  useEffect(() => {
    setSortedData(props.tracks);
  }, [props.tracks]);

  const strCmp = (a: string, b: string, isAsc: Boolean) => {
    return (isAsc ? 1 : -1) * (a.localeCompare(b, undefined, {'sensitivity': 'base'}));
  };

  const arrCompare = (a: APITrack, b: APITrack, column: 'albums' | 'genres', isAsc: Boolean) => {
    if (a[column].length === 0) {
      return (isAsc ? 1 : -1) * -1;
    } else if (b[column].length === 0) {
      return (isAsc ? 1 : -1) * 1;
    }
    const a1 = a[column][0]?.name ?? '';
    const b1 = b[column][0]?.name ?? '';
    return strCmp(a1, b1, isAsc);
  };


  const handleSort = (column: keyof APITrack) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    const sorted = [...props.tracks].sort((a, b) => {
      // `albums` and `genres` are arrays from which we display 1 element
      if (column === 'albums' || column === 'genres') {
        return arrCompare(a, b, column, isAsc);
      }
      if (typeof a[column] === 'string') {
        return strCmp((a[column] as string), (b[column] as string), isAsc);
      } else {
        return (isAsc ? 1 : -1) * (a[column] > b[column] ? 1 : -1);
      }
    });

    setSortedData(sorted);
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  return (
    <Grid sx={{paddingX: '1em'}}>
      <Table>

        <TableHead>
          <StyledTableRow>
            <TableCell className="trackListPictureCell" />
            <TableCell className="trackListNameCell">
              <TableSortLabel
                active={sortColumn === 'name'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            {!props.hideArtistCol ? 
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'artist_name'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('artist_name')}
              >
                Artist
              </TableSortLabel>
              </TableCell>
              :
              <></>
            }
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'albums'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('albums')}
              >
                Album
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'create_year'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('create_year')}
              >
                Year
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'genres'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('genres')}
              >
                Genre
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'length'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('audio_length')}
              >
                Length
              </TableSortLabel>
            </TableCell>
            <TableCell />
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((track, index) => (
            <TrackTableRow key={index} track={track} handleTrackClick={props.handleTrackClick} hideArtistCol={props.hideArtistCol} />
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
}
