import { Box, IconButton, Typography } from "@mui/material";
import NiconiComments from "@xpadev-net/niconicomments";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from 'screenfull';
import { OnProgressProps } from "react-player/base";
import { NicoContext } from "../../provider/NicoProvider";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import CommentIcon from '@mui/icons-material/Comment';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import Styled from "./VideoWatchPage.module.scss";

interface VideoWatchPageProps{
  videoId: string
};

const VideoWatchPage = (props: VideoWatchPageProps) => {
  const nicoContextValue = useContext(NicoContext);
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const session = useRef<Session | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    playing: true,
    pip: false,
    url: undefined,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    loop: false,
    playbackRate: 1,
    comment: true
  });
  const playedSeconds = useRef<number>(0);
  const durationSeconds = useRef<number>(0);
  const player = useRef<ReactPlayer>(null);
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({protocol: null, videoSrcIndex: 0});
  const canvas = useRef<HTMLCanvasElement>(null);
  const niconicomments = useRef<NiconiComments>();
  const handlePlayerProgress = (state: OnProgressProps) => {
    playedSeconds.current = state.playedSeconds;
    setPlayerStatus({...playerStatus, played: state.played, loaded: state.loaded});
  }
  const handlePlayerPlay = (value: boolean) => {
    setPlayerStatus({...playerStatus, playing: value});
  };
  const handlePiP = (value: boolean) => {
    setPlayerStatus({...playerStatus, pip: value});
  };
  const handlePlayerEnded = () => {
    setPlayerStatus({...playerStatus, playing: playerStatus.loop});
  }
  const handlePlayerDuration = (duration: number) => {
    durationSeconds.current = duration;
  }
  const handlePlayerPlaybackRateChange = (speed: number) => {
    setPlayerStatus({...playerStatus, playbackRate: speed});
  }
  const handlePlayerCommentVisible = (value: boolean) => {
    setPlayerStatus({...playerStatus, comment: value});
  }
  const handlePlayerFullscreen = () => {
    if(screenfull.isEnabled){
      if(!screenfull.isFullscreen){
        const videoPlayerEl = document.getElementById("videoPlayer");
        if(videoPlayerEl){
          screenfull.request(videoPlayerEl);
        }
      }
      else{
        screenfull.exit()
      }
    }
  }
  const handleControllerSeek = (played: number) => {
    player.current?.seekTo(played);
  }
  const [isDragging, setIsDragging] = useState(false);
  const handleControllerSeekUp = () => {
    setIsDragging(false);
  }
  const handleControllerSeekMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if(isDragging){
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = x / rect.width;
      handleControllerSeek(percentage);
    }
  }
  const handleControllerSeekDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    handleControllerSeek(percentage);
  }
  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return formattedMinutes + ':' + formattedSeconds;
  }
  const playedTimeStr = useMemo(() => {
    return formatTime(playedSeconds.current);
  }, [playedSeconds.current]);
  const durationTimeStr = useMemo(() => {
    return formatTime(durationSeconds.current);
  }, [durationSeconds.current]);
  useEffect(() => {
    (async () => {
      const _watchData = await nicoContextValue.extension.getVideoWatch(props.videoId, nicoContextValue.isLogin);
      setWatchData(_watchData);
      if(_watchData && _watchData.media.delivery && canvas.current){
        document.title = `${_watchData.video.title} | ExNicoWatch`;
        const _comment = await nicoContextValue.extension.getVideoComments(_watchData.comment.nvComment);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        niconicomments.current = new NiconiComments(canvas.current, _comment as any, {format: "v1"});
        niconicomments.current.drawCanvas(0);
        const _sendEv = await nicoContextValue.extension.sendVideoWatchEvent(_watchData.media.delivery.trackingId);
        const _protocol = _watchData.media.delivery.movie.session.protocols[0];
        setVideoConfig({...videoConfig, protocol: _protocol});
        if(_sendEv){
          const _session = await nicoContextValue.extension.sendVideoSession(_watchData.media.delivery, _protocol, _watchData.media.delivery.movie.session.videos[videoConfig.videoSrcIndex]);
          session.current = _session;
          setPlayerStatus({...playerStatus, url: _session?.content_uri});
        }
      }
    })();
  }, []);
  useEffect(() => {
    const sessionIntervalId = setInterval(async () => {
      if(session.current){
        const _session = await nicoContextValue.extension.putVideoSession(session.current);
        session.current = _session;
        setPlayerStatus((_s) => {
          if(_s.url !== _session?.content_uri){
            return {..._s, url: _session?.content_uri};
          }
          return _s;
        });
      }
    }, 40000);
    return () => clearInterval(sessionIntervalId);
  }, []);
  useEffect(() => {
    const commentRendererIntervalId = setInterval(() => {
      if(niconicomments.current && playerStatus.comment){
        niconicomments.current.drawCanvas(Math.floor(playedSeconds.current * 100));
      }
    }, 1000 / 60);
    return () => clearInterval(commentRendererIntervalId);
  }, []);
  return (
    <div>
      <Box className={Styled.playerSection}>
        <div id="videoPlayer">
          <div className={Styled.playerContainer}>
            <ReactPlayer
              ref={player}
              className={Styled.player}
              url={playerStatus.url}
              playing={playerStatus.playing}
              pip={playerStatus.pip}
              loop={playerStatus.loop}
              volume={playerStatus.volume}
              muted={playerStatus.muted}
              playbackRate={playerStatus.playbackRate}
              onProgress={handlePlayerProgress}
              onPlay={() => handlePlayerPlay(true)}
              onEnablePIP={() => handlePiP(true)}
              onDisablePIP={() => handlePiP(false)}
              onPause={() => handlePlayerPlay(false)}
              onEnded={handlePlayerEnded}
              onDuration={handlePlayerDuration}
              onPlaybackRateChange={handlePlayerPlaybackRateChange}
              progressInterval={1000 / 60}
            />
            <canvas hidden={!playerStatus.comment} className={Styled.commentCanvas} width={1920} height={1080} ref={canvas}></canvas>
          </div>
          <div>
            <div
              className={Styled.playerSliderContainer}
              onMouseMove={handleControllerSeekMove}
              onMouseUp={handleControllerSeekUp}
              onMouseDown={handleControllerSeekDown}
            >
              <div style={{width: `${playerStatus.loaded * 100}%`}} className={Styled.playerSliderLoaded} />
              <div style={{width: `${playerStatus.played * 100}%`}} className={Styled.playerSliderPlayed} />
            </div>
            <div className={Styled.controlerContainer}>
              <div className={Styled.controlerLeft}>
                <IconButton onClick={() => handlePlayerPlay(!playerStatus.playing)} title={playerStatus.playing ? "停止" : "再生"}>
                  {playerStatus.playing ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </IconButton>
              </div>
              <div className={Styled.controlerCenter}>
                {playedTimeStr}
                <span className={Styled.slash}>/</span>
                {durationTimeStr}
              </div>
              <div className={Styled.controlerRight}>
                <IconButton onClick={() => handlePlayerCommentVisible(!playerStatus.comment)} title={playerStatus.comment ? "コメントを消す" : "コメントを表示"}>
                  {playerStatus.comment ? (
                    <CommentIcon />
                  ) : (
                    <CommentsDisabledIcon />
                  )}
                </IconButton>
                <IconButton onClick={() => handlePiP(true)} title="ピクチャーインピクチャー">
                  <PictureInPictureAltIcon />
                  
                </IconButton>
                <IconButton onClick={() => handlePlayerFullscreen()} title={screenfull.isFullscreen ? "フルスクリーン解除" : "フルスクリーン"}>
                  {screenfull.isFullscreen ? (
                    <CloseFullscreenIcon />
                  ) : (
                    <OpenInFullIcon />
                  )}
                </IconButton>
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </div>
            </div>
          </div>
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
