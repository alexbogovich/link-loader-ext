const handlers = new Map();

export const handlerProvider = (parentPath = '') => {
  return {
    get(target, prop) {
      const path = parentPath ? `${parentPath}.${prop}` : prop;
      if (handlers.has(path)) {
        return handlers.get(path);
      }
      const handler = new Proxy(() => {}, handlerProvider(path));
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
    }
  };
};
