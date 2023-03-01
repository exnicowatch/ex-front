import { createTheme, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Extension from "./libs/extension";
import NicoProvider, { NicoContextProps } from "./provider/NicoProvider";

const ExtensionError = () => {
  return (
    <>
      <h1>拡張機能が導入されていません</h1>
      <p>使用するにはExNicoExtensionを導入する必要があります</p>
    </>
  );
};

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
        <Header />
        <main>
          {nicoContext.loaded && (
            <>
              {nicoContext.extension.isInstalled ? (
                <Outlet />
              ) : (
                <ExtensionError />
              )}
            </>
          )}
        </main>
      </ThemeProvider>
    </NicoProvider>
  );
};

export default Layout;
