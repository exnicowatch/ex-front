export default class Extension{
  isInstalled: boolean = true;
  version?: string;

  async initialize(){
    this.version = await this.sendMessage<string>({type: "getVersion"});
    return this.isInstalled;
  }

  private async sendMessage<T>(message: unknown): Promise<T>{
    return new Promise((resolve, rejects) => {
      if (chrome.runtime && this.isInstalled){
        chrome.runtime.sendMessage(
          "nmlkohaecenocojodbbbcigopcombbef",
          message,
          (response) => {
            resolve(response);
          }
        );
      }
      else{
        this.isInstalled = false;
        rejects("NOT_INSTALLED");
      }
    });
  }

  async getUser(id: number): Promise<[NvAPIUser | null, NvAPIRelationships | null]>{
    const user = await this.sendMessage<NvAPIResponse<NvAPIUserResponse>>({type: "fetchApi", payload: {
      url: `https://nvapi.nicovideo.jp/v1/users/${id}`,
      method: "GET"
    }});
    if(user.meta.status === 200 && user.data){
      return [user.data.user, user.data.relationships];
    }else{
      return [null, null];
    }
  }

  async getOwnUser(): Promise<[NvAPIOwnUser | null, boolean]>{
    const user = await this.sendMessage<NvAPIResponse<NvAPIOwnUserResponse>>({type: "fetchApi", payload: {
      url: `https://nvapi.nicovideo.jp/v1/users/me`,
      method: "GET"
    }});
    if(user.meta.status === 200 && user.data){
      return [user.data.user, true];
    }else{
      return [null, false];
    }
  }

  private getActionTrackId(): string{
    function generateRandomString(n: number) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    return `${generateRandomString(10)}_${Date.now()}`;
  }

  async getVideoWatch(videoId: string, isLogin: boolean): Promise<WatchData | null>{
    const url = new URL(videoId, `https://www.nicovideo.jp/api/watch/v3${isLogin ? "" : "_guest"}/`);
    url.searchParams.append('actionTrackId', this.getActionTrackId());
    const watch = await this.sendMessage<WatchAPIResponse<WatchData>>({type: "fetchApi", payload: {
      url: url.toString(),
      method: "GET"
    }});
    if(watch.meta.status === 200 && watch.data){
      return watch.data;
    }
    return null;
  }

  async sendVideoWatchEvent(trackingId: string): Promise<boolean>{
    const url = new URL("https://nvapi.nicovideo.jp/v1/2ab0cbaa/watch");
    url.searchParams.append("t", trackingId);
    const event = await this.sendMessage<NvAPIResponse<null>>({type: "fetchApi", payload: {
      url: url.toString(),
      method: "GET"
    }});
    if(event.meta.status === 200) return true;
    return false;
  }

  async sendVideoSession(media: WatchMediaDelivery, protocol: "http" | "hls", maxVideoSrcId: string): Promise<Session | null>{
    function protocolParameters(): Session["protocol"]["parameters"]["http_parameters"]["parameters"]{
      if(protocol === "hls"){
        return {
          hls_parameters: {
            segment_duration: 6000,
            transfer_preset: media.movie.session.transferPresets[0],
            use_ssl: media.movie.session.urls[0].isSsl ? "yes" : "no",
            use_well_known_port: media.movie.session.urls[0].isWellKnownPort ? "yes" : "no"
          }
        }
      }
      else{
        return {
          http_output_download_parameters: {
            transfer_preset: media.movie.session.transferPresets[0],
            use_ssl: media.movie.session.urls[0].isSsl ? "yes" : "no",
            use_well_known_port: media.movie.session.urls[0].isWellKnownPort ? "yes" : "no"
          }
        }
      }
    }
    function contentSrcIdSets(): Session["content_src_id_sets"]{
      function filterIds(ids: string[], maxId: string): string[] {
        const maxIndex = ids.indexOf(maxId);
        if (maxIndex === -1) {
          return [];
        }
        return ids.slice(maxIndex);
      }
      return [{
        content_src_ids: [{
          src_id_to_mux: {
            audio_src_ids: [media.movie.session.audios[0]],
            video_src_ids: filterIds(media.movie.session.videos, maxVideoSrcId)
          }
        }]
      }]
    }
    const sessionReq: Session = {
      client_info: {
        player_id: media.movie.session.playerId
      },
      content_auth: {
        auth_type: media.movie.session.authTypes[protocol],
        content_key_timeout: media.movie.session.contentKeyTimeout,
        service_id: "nicovideo",
        service_user_id: media.movie.session.serviceUserId
      },
      content_id: media.movie.session.contentId,
      content_src_id_sets: contentSrcIdSets(),
      content_type: "movie",
      content_uri: "",
      keep_method: {
        heartbeat: {
          lifetime: media.movie.session.heartbeatLifetime
        }
      },
      priority: media.movie.session.priority,
      protocol: {
        name: "http",
        parameters: {
          http_parameters: {
            parameters: protocolParameters()
          }
        }
      },
      recipe_id: media.recipeId,
      session_operation_auth: {
        session_operation_auth_by_signature: {
          signature: media.movie.session.signature,
          token: media.movie.session.token
        }
      },
      timing_constraint: "unlimited"
    }
    const sessionRes = await this.sendMessage<SessionAPIResponse>({type: "fetchApi", payload: {
      url: "https://api.dmc.nico/api/sessions?_format=json",
      method: "POST",
      param: {
        session: sessionReq
      }
    }});
    if(sessionRes.meta.status === 201 && sessionRes.data){
      return sessionRes.data.session;
    }
    return null;
  }

  async putVideoSession(session: Session): Promise<Session | null>{
    const sessionRes = await this.sendMessage<SessionAPIResponse>({type: "fetchApi", payload: {
      url: `https://api.dmc.nico/api/sessions/${session.id}?_format=json&_method=PUT`,
      method: "POST",
      param: {
        session: session
      }
    }});
    if(sessionRes.meta.status === 200 && sessionRes.data){
      return sessionRes.data.session;
    }
    return null;
  }

  async getVideoComments(nvComment: WatchNvComment, when?: number, res_from?: number): Promise<NvThread[]>{
    const commentReq: NvCommentAPIRequest = {
      threadKey: nvComment.threadKey,
      additionals: {
        when: when,
        res_from: res_from
      },
      params: nvComment.params
    }
    const comments = await this.sendMessage<NvCommentAPIResponse<NvCommentGetResponse>>({type: "fetchApi", payload: {
      url: "https://nvcomment.nicovideo.jp/v1/threads",
      method: "POST",
      param: commentReq,
      header: {
        "Referer": "https://www.nicovideo.jp/"
      }
    }});
    if(comments.meta.status === 200 && comments.data){
      return comments.data.threads;
    }
    return [];
  }

  async getVideoCommentPostkey(threadId: number | string): Promise<string | null>{
    const postKey = await this.sendMessage<NvAPIResponse<NvAPIPostkey>>({type: "fetchApi", payload: {
      url: `https://nvapi.nicovideo.jp/v1/comment/keys/post?threadId=${threadId}`,
      method: "GET"
    }});
    if(postKey.meta.status === 200 && postKey.data){
      return postKey.data.postKey;
    }
    return null;
  }

  async postVideoComment(videoId: string, threadId: string, postKey: string, body: string, commands: string[], vposMs: number): Promise<[number | null, string | null]>{
    const postCommentReq: NvCommentAPIPostRequest = {
      body: body,
      commands: commands,
      postKey: postKey,
      videoId: videoId,
      vposMs: vposMs
    };
    const postCommentRes = await this.sendMessage<NvCommentAPIResponse<NvCommentPostResponse>>({type: "fetchApi", payload: {
      url: `https://nvcomment.nicovideo.jp/v1/threads/${threadId}/comments`,
      method: "POST",
      param: postCommentReq,
      header: {
        "Referer": "https://www.nicovideo.jp/"
      }
    }});
    if(postCommentRes.meta.status === 201 && postCommentRes.data){
      return [postCommentRes.data.no, postCommentRes.data.id];
    }
    return [null, null];
  }
}
