import { Grid, Typography } from "@mui/material";
import React from "react";
import Styled from "./ExtensionError.module.scss";

const ExtensionError = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      className={Styled.extensionError}
    >
      <Typography variant="h1" className={Styled.title}>
        ExNicoWatch
      </Typography>
      <Typography variant="h5" component="p" className={Styled.subTitle}>
        ニコニコ動画のちょっと強いプレイヤー
      </Typography>
      <p className={Styled.description}>
        使用するにはブラウザ拡張機能(
        <a href="https://github.com/exnicowatch/ex-extension" target="_blank" rel="noreferrer">ExNicoExtension</a>
        )を導入する必要があります。</p>
    </Grid>
  );
};

export default ExtensionError;
