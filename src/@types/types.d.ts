interface VideoConfig{
  protocol: "hls" | "http" | null
  videoSrcIndex: number
}

interface PlayerStatus{
  playing: boolean
  pip: boolean
  url: string | undefined
  volume: number
  muted: boolean
  played: number
  loaded: number
  loop: boolean
  playbackRate: number
}
