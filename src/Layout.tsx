import { createTheme, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Extension from "./libs/extension";
import ExtensionError from "./pages/extension/ExtensionError";
import NicoProvider, { NicoContextProps } from "./provider/NicoProvider";

const Layout = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<PaletteMode>(prefersDarkMode ? "dark" : "light");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );
  const [nicoContext, setNicoContext] = useState<NicoContextProps>({
    isLogin: false,
    loaded: false,
    extension: new Extension(),
  });
  useEffect(() => {
    (async () => {
      try {
        await nicoContext.extension.initialize();
      } catch (error) {
        console.error(error);
      }
      setNicoContext({...nicoContext, loaded: true});
    })();
  }, []);
  useEffect(() => {
    setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);
  return (
    <NicoProvider value={nicoContext}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {nicoContext.loaded && (
          <>
            {nicoContext.extension.isInstalled ? (
              <>
                <Header />
                <main>
                  <Outlet />
                </main>
              </>
            ) : (
              <ExtensionError />
            )}
          </>
        )}
      </ThemeProvider>
    </NicoProvider>
  );
};

export default Layout;
