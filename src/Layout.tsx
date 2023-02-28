import { createTheme, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";

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
  useEffect(() => {
    setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main>{window.ex === undefined ? <ExtensionError /> : <Outlet />}</main>
    </ThemeProvider>
  );
};

export default Layout;
