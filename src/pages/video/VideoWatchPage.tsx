import { Box, IconButton, Slider, Typography } from "@mui/material";
import NiconiComments from "@xpadev-net/niconicomments";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from 'screenfull';
import htmlParse from 'html-react-parser';
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FolderIcon from '@mui/icons-material/Folder';
import Styled from "./VideoWatchPage.module.scss";
import PlayerSlider from "../../components/PlayerSlider/PlayerSlider";
import VideoPlayerConfig from "../../components/VideoPlayerConfig/VideoPlayerConfig";
import { Link } from "react-router-dom";

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
    volume: 100,
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
  const [openVideoConfig, setOpenVideoConfig] = useState(false);
  const [videoConfigAnchorEl, setVideoConfigAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({protocol: null, videoSrcIndex: 0});
  const canvas = useRef<HTMLCanvasElement>(null);
  const niconicomments = useRef<NiconiComments>();
  const handlePlayerReady = () => {
    if(player.current && niconicomments.current){
      //niconicomments.current.video = player.current.getInternalPlayer() as HTMLVideoElement;
    }
  }
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
  const handlePlayerVolumeChange = (_: Event, value: number | number[]) => {
    setPlayerStatus({...playerStatus, volume: value as number});
  }
  const handlePlayerMuted = (value: boolean) => {
    setPlayerStatus({...playerStatus, muted: value});
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
  const handleVideoConfigOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenVideoConfig(true);
    setVideoConfigAnchorEl(e.currentTarget);
  };
  const handleVideoConfigClose = () => {
    setOpenVideoConfig(false);
    setVideoConfigAnchorEl(null);
  };
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
  const playerVolume = useMemo(() => {
    return playerStatus.volume / 100;
  }, [playerStatus.volume]);
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
              volume={playerVolume}
              muted={playerStatus.muted}
              playbackRate={playerStatus.playbackRate}
              onReady={handlePlayerReady}
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
            <PlayerSlider
              played={playerStatus.played}
              loaded={playerStatus.loaded}
              onChange={handleControllerSeek}
            />
            <div className={Styled.controlerContainer}>
              <div className={Styled.controlerLeft}>
                <IconButton onClick={() => handlePlayerPlay(!playerStatus.playing)} title={playerStatus.playing ? "停止" : "再生"}>
                  {playerStatus.playing ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </IconButton>
                <div className={Styled.playerVolumeContainer}>
                  <IconButton onClick={() => handlePlayerMuted(!playerStatus.muted)}>
                    {playerStatus.muted ? (
                      <VolumeOffIcon />
                    ) : (
                      <VolumeUpIcon />
                    )}
                  </IconButton>
                  <Slider
                    size="small"
                    min={0}
                    max={100}
                    value={playerStatus.volume}
                    onChange={handlePlayerVolumeChange}
                    disabled={playerStatus.muted}
                  />
                </div>
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
                <IconButton onClick={handleVideoConfigOpen} title="設定">
                  <SettingsIcon />
                </IconButton>
                <VideoPlayerConfig isOpen={openVideoConfig} setIsOpen={setOpenVideoConfig} anchorEl={videoConfigAnchorEl} onClose={handleVideoConfigClose} />
              </div>
            </div>
          </div>
        </div>
        {watchData && (
          <div className={Styled.videoDetail}>
            <Typography className={Styled.videoTitle} variant="h6" component="h1">{watchData?.video.title}</Typography>
            <div className={Styled.videoMeta}>
              <div className={Styled.videoMetaCount}>
                <PlayArrowIcon />
                {watchData.video.count.view.toLocaleString()}
              </div>
              <div className={Styled.videoMetaCount}>
                <CommentIcon />
                {watchData.video.count.comment.toLocaleString()}
              </div>
              <div className={Styled.videoMetaCount}>
                <FolderIcon />
                {watchData.video.count.mylist.toLocaleString()}
              </div>
              <div>
                {new Date(watchData.video.registeredAt).toLocaleString()}
              </div>
              <div>
                <Link to={"/genre/"+watchData.genre.key}>{watchData.genre.label}</Link>
              </div>
            </div>
            <div className={Styled.videoTags}>
              {watchData.tag.items.map((t, i) => (
                <div key={i} className={`${Styled.videoTag} ${t.isLocked ? Styled.tagLocked : ""}`}>
                  <Link to={"/tag/"+t.name}>{t.name}</Link>
                  {t.isNicodicArticleExists && (
                    <span className={Styled.tagDictionary}>
                      <a target="_blank" rel="noreferrer noopener" href={"https://dic.nicovideo.jp/a/"+t.name}>百</a>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={Styled.videoDescription}>
              {htmlParse(watchData.video.description)}
            </div>
          </div>
        )}
      </Box>
      <Box></Box>
    </div>
  )
};

export default VideoWatchPage;
