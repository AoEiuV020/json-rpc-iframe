import {
  JSONRPCServerAndClient,
  JSONRPCServer,
  JSONRPCClient,
} from "json-rpc-2.0";

export class JsonRpcIframe {
  private serverAndClient: JSONRPCServerAndClient;
  private remoteWindow: Window;

  constructor(remoteWindow: Window) {
    this.remoteWindow = remoteWindow;

    const server = new JSONRPCServer();
    const client = new JSONRPCClient((request) => {
      try {
        this.remoteWindow.postMessage(JSON.stringify(request), "*");
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    });

    this.serverAndClient = new JSONRPCServerAndClient(server, client);

    // 绑定消息事件监听
    window.addEventListener("message", this.onMessage.bind(this));
  }

  private onMessage(event: MessageEvent) {
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data && typeof data === "object") {
        this.serverAndClient.receiveAndSend(data);
      }
    } catch (error) {
      console.error("Invalid JSON RPC message received:", event.data, error);
    }
  }

  public registerMethod<TParams, TResult>(
    name: string,
    handler: (params?: TParams) => TResult | Promise<TResult>
  ) {
    this.serverAndClient.addMethod(name, handler);
  }
  public unregisterMethod(name: string): void {
    this.serverAndClient.removeMethod(name);
  }

  public async sendRequest(method: string, params?: object): Promise<any> {
    return this.serverAndClient.request(method, params);
  }

  public sendNotification(method: string, params?: object): void {
    this.serverAndClient.notify(method, params);
  }

  public destroy() {
    window.removeEventListener("message", this.onMessage.bind(this));
    this.serverAndClient.rejectAllPendingRequests("Connection is closed.");
  }
}
