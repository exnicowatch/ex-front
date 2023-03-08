interface NvCommentAPIResponse<T> {
  meta: {
    status: number;
    errorCode?: string;
  };
  data?: T;
}

interface NvCommentGetResponse {
  globalComments: NvGlobalComment[];
  threads: NvThread[];
}

interface NvGlobalComment {
  id: string;
  count: number;
}

interface NvThread {
  commentCount: number;
  fork: string;
  id: string;
  comments: NvComment[];
}

interface NvComment {
  body: string;
  commands: string[];
  id: string;
  isMyPost: boolean;
  isPremium: boolean;
  nicoruCount: number;
  nicoruId: string | null;
  no: number;
  postedAt: string;
  score: number;
  source: "leaf" | "nicoru" | "trunk";
  userId: string;
  vposMs: number;
}

interface NvCommentAPIRequest {
  threadKey: string;
  additionals: {
    when?: number;
    res_from?: number;
  };
  params: {
    targets: WatchNvCommentTarget[];
    language: string;
  };
}

interface NvCommentAPIPostRequest {
  body: string;
  commands: string[];
  postKey: string;
  videoId: string;
  vposMs: number;
}

interface NvCommentPostResponse {
  id: string;
  no: number;
}
