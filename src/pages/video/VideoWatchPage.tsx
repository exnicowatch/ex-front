import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { NicoContext } from "../../provider/NicoProvider";

interface VideoWatchPageProps{
  videoId: string
};

const VideoWatchPage = (props: VideoWatchPageProps) => {
  const nicoContextValue = useContext(NicoContext);
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const session = useRef<Session | null>(null);
  const [contentUri, setContentUri] = useState<string | undefined>(undefined);
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({protocol: null, videoSrcIndex: 0});
  useEffect(() => {
    (async () => {
      const _watchData = await nicoContextValue.extension.getVideoWatch(props.videoId, nicoContextValue.isLogin);
      setWatchData(_watchData);
      if(_watchData && _watchData.media.delivery){
        const _sendEv = await nicoContextValue.extension.sendVideoWatchEvent(_watchData.media.delivery.trackingId);
        const _protocol = _watchData.media.delivery.movie.session.protocols[0];
        setVideoConfig({...videoConfig, protocol: _protocol});
        if(_sendEv){
          const _session = await nicoContextValue.extension.sendVideoSession(_watchData.media.delivery, _protocol, _watchData.media.delivery.movie.session.videos[videoConfig.videoSrcIndex]);
          session.current = _session;
          setContentUri(_session?.content_uri);
        }
      }
    })();
  }, []);
  useEffect(() => {
    const sessionIntervalId = setInterval(async () => {
      if(session.current){
        const _session = await nicoContextValue.extension.putVideoSession(session.current);
        session.current = _session;
        setContentUri(_session?.content_uri);
      }
    }, 40000);
    return () => clearInterval(sessionIntervalId);
  }, []);
  return (
    <div>
      <Box>
        <div>
          <ReactPlayer url={contentUri} playing={true} />
        </div>
        <div>
          <Typography variant="h5" component="h1">{watchData?.video.title}</Typography>
        </div>
      </Box>
      <Box></Box>
    </div>
  )
};

export default VideoWatchPage;
