export default class Extension{
  isInstalled: boolean = true;
  version?: string;

  async initialize(){
    this.version = await this.sendMessage<string>({type: "getVersion"});
    return this.isInstalled;
  }

  async sendMessage<T>(message: unknown): Promise<T>{
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
}
