import { Slider, Stack, Typography } from "@mui/material";

export default function MediaPlayer() {
  return (
    <div style={{ padding: "16px", background: "white", boxShadow: "10px 10px 10px 10px #AAAAAA" }}>
      <Stack direction="row" spacing={2}>

        <Typography>Music player goes here</Typography>
        
        <Slider 
          size="small"
          defaultValue={50}
          aria-label="Duration slider"
        />
      </Stack>
    </div>
  );
}
