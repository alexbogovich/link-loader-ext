import { get } from 'lodash'
import MessageSender = chrome.runtime.MessageSender;
import LinkList from "./list-list";
import {SDK} from "~/sdk";

const sdk: SDK = {
  links: LinkList.init(),
  dev: false
}

const messageHandler = async (request: any, sender: MessageSender, callback: any) => {
  console.log(sender.tab ? `from a content script:${sender.tab.url}` : "from the extension");
  if (request.method) {
    const resource = get(sdk, request.method);
    if (!resource) {
      return callback(null);
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
           * chrome.runtime.sendMessage({ method: 'multiArgument', arguments: [1, 2, 3] }, () => { ... })
           *
           * */
          response = await resource(...request.arguments);
        }
        callback(response);
      } catch (e) {
        console.error(`error on execute method ${request.method} on sdk`, e);
        callback({error: e});
      }
    } else {
      callback(resource);
    }
  }

  callback(null)
}

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    console.log(sender.tab ? `from a content script:${sender.tab.url}` : "from the extension");
    messageHandler(request, sender, callback)
    return true
  }
)
