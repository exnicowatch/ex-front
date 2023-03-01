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

  async getUser(id: number): Promise<[NvAPIUser | null, NvAPIrelationships | null]>{
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
}
