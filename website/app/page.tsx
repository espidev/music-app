'use client'

import { useLoginStateContext } from "@/components/loginstateprovider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const loginState = useLoginStateContext();

  const router = useRouter();

  useEffect(() => {
    if (loginState.loggedInStateValid) {
      if (!loginState.isLoggedIn) {
        router.push('/login');
      } else {
        router.push(`/collection`);
      }
    }
  }, [loginState]);

  return <>Loading...</>;
}