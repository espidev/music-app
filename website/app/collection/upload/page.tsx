'use client'

import { useLoginCheckEffect, useLoginStateContext } from "@/components/loginstateprovider";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CollectionUploadPage() {
  const router = useRouter();
  const loginState = useLoginStateContext();

  useLoginCheckEffect(router, loginState);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  return (
    <Box sx={{ height: 1 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Upload</Typography>
      </Box>
    </Box>
  );
}