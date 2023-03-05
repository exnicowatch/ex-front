interface NvCommentAPIResponse{
  meta: {
    status: number
    errorCode: string
  }
  data?: {
    globalComments: NvGlobalComment[]
    threads: NvThread[]
  }
}

interface NvGlobalComment{
  id: string
  count: number
}

interface NvThread{
  commentCount: number
  fork: string
  id: string
  comments: NvComment[]
}

interface NvComment{
  body: string
  comments: string[]
  id: string
  isMyPost: boolean
  isPremium: boolean
  nicoruCount: number
  nicoruId: string | null
  no: number
  postedAt: string
  score: number
  source: "leaf" | "nicoru" | "trunk"
  userId: string
  vposMs: number
}

interface NvCommentAPIRequest{
  threadKey: string
  additionals: {
    when?: number
    res_from?: number
  }
  params: {
    targets: WatchNvCommentTarget[]
    language: string
  }
}
