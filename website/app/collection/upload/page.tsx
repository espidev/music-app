'use client'

import { useLoginCheckEffect, useLoginStateContext } from "@/components/loginstateprovider";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'

import '@/app/collection/upload/style.css';
import { apiPostCollectionTracks } from "@/components/apiclient";

export default function CollectionUploadPage() {
  const router = useRouter();
  const loginState = useLoginStateContext();

  const [files, setFiles] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles.map((file: any) => { return { uploaded: false, file }; }));
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  useLoginCheckEffect(router, loginState);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleUpload = () => {
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i].file, (files[i].file as any).name);

      apiPostCollectionTracks(loginState.loggedInUserUuid, formData)
        .then(res => {
          const newFiles = files.map((file: any, index) => {
            if (index === i) {
              file.uploaded = true;
            }
            return file;
          });

          setFiles(newFiles);
        })
        .catch(err => {
          // TODO display error popup
        });
    }
  };

  return (
    <Box sx={{ height: 1 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Upload</Typography>

        <br />
        <br />
        <br />

        <div {...getRootProps()} className="drop-area">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop files here...</p> :
              <p>Drag and drop files here, or click to select files</p>
          }

        </div>
        <Button variant="contained" onClick={handleUpload}>Upload</Button>

        <ul>
          {
            files.map((file: any, index) => (
              <li key={index}>
                {file.file.name}
                {file.uploaded ? ' (uploaded)' : ''}
              </li>
            ))
          }
        </ul>

      </Box>
    </Box>
  );
}
