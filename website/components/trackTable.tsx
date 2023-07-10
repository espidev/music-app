import { APITrack } from "@/util/models/track";
import format from 'format-duration';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function TrackTable(props: { tracks: APITrack[], handleTrackClick: (track: APITrack) => void }) {
  return (
    <table className="trackTable">
        <thead>
          <tr>
            <th className="trackListPictureCell" />
            <th className="trackListNameCell">Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
          {
            props.tracks.map((track, index) => (
              <tr key={index}>
                <td className="trackListPictureCell">
                  <LazyLoadImage 
                    className="trackImage"
                    src={track.thumbnail_src}
                    alt={track.name}
                    style={{ width: 50, height: 50 }}
                  />
                </td>
                <td onClick={() => props.handleTrackClick(track)}>{track.name}</td>
                <td>{track.artist_name}</td>
                <td>{track.albums.length > 0 ? track.albums[0].name : ''}</td>
                <td>{track.create_year}</td>
                <td>{track.genres.length > 0 ? track.genres[0].name : ''}</td>
                <td>{format(track.audio_length * 1000 )}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
  )
}