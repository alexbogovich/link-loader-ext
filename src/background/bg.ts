import { get } from 'lodash';
import { sdk } from './sdk';

const messageHandler = async (
  request: any,
  sender: chrome.runtime.MessageSender,
  // eslint-disable-next-line
  callback: any,
) => {
  console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
  if (!request.method) {
    callback(null);
    return;
  }

  const resource = get(sdk, request.method);
  if (!resource) {
    callback(null);
    return;
  }
  if (typeof resource === 'function') {
    try {
      let response;
      if (request.arguments) {
        /*
         * Handle case with multiple arguments
         * sdk.multiArgument = (a, b, c) => { .... }
         *
         * In Content/Popup
         * chrome.runtime.sendMessage({ method: 'method', arguments: [1, 2, 3] }, () => { ... })
         *
         * */
        response = await resource(...request.arguments);
      }
      callback(response);
    } catch (e) {
      console.error(`error on execute method ${request.method} on sdk`, e);
      callback({ error: e });
    }
  } else {
    callback(resource);
  }
};

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
  messageHandler(request, sender, callback);
  return true;
});
