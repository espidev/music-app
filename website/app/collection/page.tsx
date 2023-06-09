'use client'

import { apiGetCollectionTracks } from "@/components/apiclient";
import { useAppStateContext } from "@/components/appstateprovider";
import { APITrack } from "@/util/models/track";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionPage() {
  const appstate = useAppStateContext();
  const router = useRouter();

  const [tracks, setTracks] = useState([] as APITrack[]);

  useEffect(() => {
    if (!appstate.isLoggedIn) {
      router.push('/login');
    }

    apiGetCollectionTracks(appstate.loggedInUserUuid)
      .then((res) => {
        setTracks(res.data as APITrack[]);
      })
      .catch(err => {
        console.error(err);
        // TODO UI error popup
      });
  }, []);

  return (
    <ul>
      {
        tracks.map((track, index) => (
          <li key={index}>{track.name}</li>
        ))
      }
    </ul>
  );
}