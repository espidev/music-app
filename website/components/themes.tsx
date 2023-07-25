import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'rgb(255,245,245)',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(5,10,25)',
    },
  },
});
