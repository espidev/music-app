import { useState, useEffect } from "react";
import format from "format-duration";
import { APITrack } from "@/util/models/track";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Grid, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Button, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {styled} from '@mui/system';
import React from "react";
import { MoreVertOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppStateContext } from "./appstateprovider";
import { lightTheme, darkTheme } from "./themes";
import TrackMenu from "./trackmenu";

const StyledTableRow = styled(TableRow)(
  ({theme}) => ({
      padding: 0,
      margin: 0,
      "&:hover": {backgroundColor: theme.palette.background.paper, transition: "all 0.2s ease-in-out"},
      cursor: "pointer",
      color: theme.palette.text.primary,
  })
);

function TrackTableRow(props: { 
    track: APITrack, 
    handleTrackClick: (track: APITrack) => void, 
    hideArtistCol?: boolean, 
    hideGenreCol?: boolean, 
    showRankingCol?: boolean, 
    ranking?: number,
    handleTrackUpdate: () => void,
  }) {
  const router = useRouter();
  const appState = useAppStateContext();
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  
  const track = props.track;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <StyledTableRow>

      {props.showRankingCol && props.ranking ? 
        <TableCell>
          {props.ranking}
          </TableCell> 
          : 
          <></>
      }

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
        !props.hideArtistCol ? 
        <TableCell onClick={() => { router.push(`/collection/artists/${track.artists[0].id}`) }}>
          {track.artist_name}
          </TableCell> 
          : 
          <></>
      }
      
      <TableCell onClick={() => { router.push(`/collection/albums/${track.albums[0].id}`); }}>
        {track.albums.length > 0 ? track.albums[0].name : ''}
      </TableCell>

      <TableCell>{track.create_year}</TableCell>

      {
        !props.hideGenreCol ? 
        <TableCell onClick={() => { router.push(`/collection/artists/${track.genres[0].id}`) }}>
          {track.genres.length > 0 ? track.genres[0].name : ''}
          </TableCell> 
          : 
          <></>
      }

      <TableCell>{format(track.audio_length * 1000)}</TableCell>

      <TableCell onClick={() => {}}>
        <Button
          id="menu-button"
          onClick={(event) => handleMenuClick(event)}
          sx={{ borderRadius: '1em', padding: 0, margin: 0, width: "0.5em" }}
        >
          <MoreVertOutlined fontSize="small" sx={{color: appState.theme === "dark" ? "whitesmoke" : "#000"}}/>
        </Button>

        <TrackMenu 
          track={track} 
          anchorEl={menuAnchorEl} 
          requestClose={handleMenuClose}
          handleTrackUpdate={props.handleTrackUpdate}
        />
      </TableCell>
    </StyledTableRow>
  );
}

export default function TrackTable(props: { 
                                            tracks: APITrack[], 
                                            handleTrackClick: (track: APITrack) => void,
                                            hideArtistCol?: boolean,
                                            hideGenreCol?: boolean,
                                            showRankingCol?: boolean,
                                            handleTrackUpdate: () => void }) {
  const appState = useAppStateContext();
  const theme = appState.theme;
  const [sortedData, setSortedData] = useState(props.tracks);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("id");

  // Is login state checking required here? I don't think so.

  // This is required because at first, props.tracks is an empty array
  useEffect(() => {
    setSortedData(props.tracks);
  }, [props.tracks]);

  const strCmp = (a: string, b: string, isAsc: Boolean) => {
    return (
      (isAsc ? 1 : -1) * a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  };

  const arrCompare = (
    a: APITrack,
    b: APITrack,
    column: "albums" | "genres",
    isAsc: Boolean
  ) => {
    if (a[column].length === 0) {
      return (isAsc ? 1 : -1) * -1;
    } else if (b[column].length === 0) {
      return (isAsc ? 1 : -1) * 1;
    }
    const a1 = a[column][0]?.name ?? "";
    const b1 = b[column][0]?.name ?? "";
    return strCmp(a1, b1, isAsc);
  };

  const handleSort = (column: keyof APITrack) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    const sorted = [...props.tracks].sort((a, b) => {
      // `albums` and `genres` are arrays from which we display 1 element
      if (column === "albums" || column === "genres") {
        return arrCompare(a, b, column, isAsc);
      }
      if (typeof a[column] === "string") {
        return strCmp(a[column] as string, b[column] as string, isAsc);
      } else {
        return (isAsc ? 1 : -1) * (a[column] > b[column] ? 1 : -1);
      }
    });

    setSortedData(sorted);
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };


  const color = theme === 'dark' ? 'white' : 'rgb(50, 50, 50)';

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Grid sx={{paddingX: '1em', color: color}}>
        <Table>

          <TableHead>
            <StyledTableRow>
              {props.showRankingCol ? <TableCell className="trackListRankCell" /> : <></>}
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
              {!props.hideGenreCol ? 
              <TableCell>
              <TableSortLabel
                active={sortColumn === 'genres'}
                direction={sortDirection as 'asc' | 'desc'}
                onClick={() => handleSort('genres')}
              >
                Genre
              </TableSortLabel>
            </TableCell>
                :
                <></>
              }
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
              <TrackTableRow
                key={index}
                track={track}
                handleTrackClick={props.handleTrackClick}
                hideArtistCol={props.hideArtistCol}
                hideGenreCol={props.hideGenreCol}
                showRankingCol={props.showRankingCol}
                ranking={index + 1}
                handleTrackUpdate={props.handleTrackUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </ThemeProvider>
  );
}
