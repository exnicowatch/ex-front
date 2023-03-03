import { Box, Popover } from "@mui/material";
import React from "react";
import Styled from "./VideoPlayerConfig.module.scss";

interface VideoPlayerConfigProps{
  isOpen: boolean,
  setIsOpen: (v: boolean) => void,
  onClose: () => void,
  anchorEl: HTMLButtonElement | null
}

const VideoPlayerConfig = (props: VideoPlayerConfigProps) => {
  return (
    <Popover
      open={props.isOpen}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      onClose={props.onClose}
      className={Styled.videoPlayerConfig}
    >
      <Box>
        Config
      </Box>
    </Popover>
  )
}

export default VideoPlayerConfig;
