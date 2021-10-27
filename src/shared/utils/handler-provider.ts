const handlers = new Map<string, any>();

type IHandlerProvider = (parentPath?: string) => ProxyHandler<any>

const handlerProvider: IHandlerProvider = (parentPath = '') => ({
  get(target, prop) {
    const path = parentPath ? `${parentPath}.${String(prop)}` : String(prop);
    if (handlers.has(path)) {
      return handlers.get(path);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handler = new Proxy(() => {}, handlerProvider(String(path)));
    handlers.set(path, handler);
    return handler;
  },
  apply(target, that, args) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ method: parentPath, arguments: args }, response => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(`Error: ${parentPath}`, args, error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  },
});

export default handlerProvider;
