# json-rpc-iframe
将iframe内外通信的postMessage封装成jsonRpc，

```js
rpc = new JsonRpcIframe(iframeWindow);
// 接收来自 iframe 的消息
rpc.registerMethod("click", (params) => {
  const iframeResponse = document.getElementById("iframeResponse");
  iframeResponse.textContent = "收到来自 iframe 的消息: " + params.time + ", " + params.message;
});
```

```js
// 向 iframe 发送消息
function sendMessageToIframe() {
  const message = document.getElementById("messageToIframe").value;
  rpc.sendRequest("click", { time: Date.now(), message: message });
}
```

```js
const rpc = new JsonRpcIframe(window.parent);
// 接收来自父页面的消息
rpc.registerMethod("click", (params) => {
  const parentMessage = document.getElementById("parentMessage");
  parentMessage.textContent = "收到来自父页面的消息: " + params.time + ", " + params.message;
});
// 向父页面发送消息
function sendMessageToParent() {
  const message = document.getElementById("messageToParent").value;
  rpc.sendRequest("click", { time: Date.now(), message: message });
}
```
页面结束需要销毁，会reject所有未处理的请求，
```js
rpc.destroy();
```