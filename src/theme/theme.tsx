import { blue } from "@mui/material/colors";
import { createTheme, responsiveFontSizes, Theme } from "@mui/material/styles";

// Create a theme instance.
export default function getTheme(): Theme {
  return responsiveFontSizes(
    createTheme({
      palette: {
        mode: "light",
        primary: blue,
        background: {
          default: "#fafafa",
        },
      },
      typography: {
        fontFamily: "'Nunito', sans-serif",
        h1: {
          fontSize: "2.1rem",
          fontWeight: 700,
        },
        h2: {
          fontSize: "1.4rem",
          fontWeight: 600,
        },
        h3: {
          fontSize: "1.1rem",
          fontWeight: 600,
          lineHeight: 1.25,
        },
        h4: {
          fontSize: "0.7rem",
          fontWeight: 600,
          lineHeight: 1,
        },
        subtitle1: {
          fontSize: "1.0rem",
          fontWceight: 400,
          lineHeight: 1.5,
          color: "#85858B",
        },
        subtitle2: {
          fontSize: "0.8rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "#BBBBC1",
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontSize: "1rem",
            },
          },
        },
      },
    })
  );
}
