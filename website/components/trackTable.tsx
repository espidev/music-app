import { useState, useEffect } from "react";
import format from 'format-duration';
import { APITrack } from "@/util/models/track";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from '@mui/material';

export default function TrackTable(props: { tracks: APITrack[], handleTrackClick: (track: APITrack) => void }) {
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
        console.log("sorting by albums or genres: ", a[column]);
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
    <Table>
      <TableHead>
        <TableRow>
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
          <TableCell>
            <TableSortLabel
              active={sortColumn === 'artist_name'}
              direction={sortDirection as 'asc' | 'desc'}
              onClick={() => handleSort('artist_name')}
            >
              Artist
            </TableSortLabel>
          </TableCell>
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
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map((track, index) => (
          <TableRow key={index} onClick={() => props.handleTrackClick(track)}
            sx={{"&:hover": {backgroundColor: "rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease-in-out"}, cursor: "pointer"}}
          >
            <TableCell className="trackListPictureCell">
              <LazyLoadImage
                className="trackImage"
                src={track.thumbnail_src}
                alt={track.name}
                style={{ width: 50, height: 50 }}
              />
            </TableCell>
            <TableCell>{track.name}</TableCell>
            <TableCell>{track.artist_name}</TableCell>
            <TableCell>{track.albums.length > 0 ? track.albums[0].name : ''}</TableCell>
            <TableCell>{track.create_year}</TableCell>
            <TableCell>{track.genres.length > 0 ? track.genres[0].name : ''}</TableCell>
            <TableCell>{format(track.audio_length * 1000)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
