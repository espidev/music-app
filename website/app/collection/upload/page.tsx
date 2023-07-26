'use client'

import { useLoginCheckEffect, useLoginStateContext } from "@/components/loginstateprovider";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'

import '@/app/collection/upload/style.css';
import { apiPostCollectionTracks } from "@/components/apiclient";
import AlertComponent, { AlertEntry } from "@/components/alerts";

export default function CollectionUploadPage() {
  const router = useRouter();
  const loginState = useLoginStateContext();

  const [files, setFiles] = useState<any[]>([]);
  const [alerts, setAlerts] = useState([] as AlertEntry[]);

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles.map((file: any) => { return { uploaded: false, file }; }));
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  useLoginCheckEffect(router, loginState);

  if (!loginState.loggedInStateValid) {
    return <></>;
  }

  const handleUpload = async () => {
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i].file, (files[i].file as any).name);

      // TODO don't block here
      // we currently have a race condition for uploading so we'll do it sequentially for now
      await apiPostCollectionTracks(loginState.loggedInUserUuid, formData)
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
          setAlerts([...alerts, { severity: "error", message: "Error uploading file, see console for details." }]);
          console.error(err);
        });
    }
  };

  return (
    <Box sx={{ height: 1 }}>
      <AlertComponent alerts={alerts} setAlerts={setAlerts} />

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
              <p>
                Drag and drop files here, or click to select files

                <br />
              </p>
          }

        </div>

        {
          files.length > 0 ?
            <Button variant="outlined" onClick={handleUpload} size="large">Upload</Button> :
            <></>
        }

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
