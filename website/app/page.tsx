'use client'

import { useAppStateContext } from "@/components/appstateprovider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const appstate = useAppStateContext();

  const router = useRouter();

  useEffect(() => {
    if (!appstate.isLoggedIn) {
      router.push('/login');
    } else {
      router.push(`/collection`);
    }
  }, []);

  return <>This is a test</>;
}