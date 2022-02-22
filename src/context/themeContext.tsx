import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createContext, useContext, useEffect, useState } from "react";
import getTheme from "theme/theme";

export enum ThemeMode {
  Light = "light",
  System = "system",
  Dark = "dark",
}

export interface ThemeContextType {
  themeMode: ThemeMode;
  imageAppend: string;
  setThemeMode: (themeMode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: ThemeMode.System,
  imageAppend: "",
  setThemeMode: () => {
    console.log("Oops");
  },
});

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props): JSX.Element {
  const [themeMode, setThemeMode] = useState(ThemeMode.System);
  const [theme, setTheme] = useState(getTheme());
  const [imageAppend, setImageAppend] = useState("");

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";

  function changeThemeMode(themeMode: ThemeMode) {
    window.localStorage.setItem("themeMode", themeMode);
    setThemeMode(themeMode);
  }

  useEffect(() => {
    if (process.browser) {
      const localTheme = window.localStorage.getItem("themeMode");
      localTheme
        ? setThemeMode(localTheme as ThemeMode)
        : changeThemeMode(ThemeMode.System);

      if (themeMode === ThemeMode.Dark) {
        setTheme(getTheme());
        setImageAppend("_dark");
      } else if (themeMode === ThemeMode.Light) {
        setTheme(getTheme());
        setImageAppend("");
      } else if (themeMode === ThemeMode.System) {
        setTheme(getTheme());
        if (preferredMode === "dark") {
          setImageAppend("_dark");
        } else {
          setImageAppend("");
        }
      }
    }
  }, [preferredMode, themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider
        value={{
          themeMode: themeMode,
          imageAppend: imageAppend,
          setThemeMode: changeThemeMode,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
