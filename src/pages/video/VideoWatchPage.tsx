import React from "react";

interface VideoWatchPageProps{
  videoId: string
};

const VideoWatchPage = (props: VideoWatchPageProps) => {
  return (
    <div>Video: {props.videoId}</div>
  )
};

export default VideoWatchPage;
