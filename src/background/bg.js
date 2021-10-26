import {get} from 'lodash'

const sdk = {}

class LinkList {
  links = []
  storage_key = 'links_v1'

  getLinks = () => {
    return this.links
  }

  addLink = (link) => {
    if (!this.links.includes(link)) {
      this.links.push(link)
    }
    this.persistLinks()
  }

  removeLink = (link) => {
    this.links = this.links.filter(l => l !== link)
    this.persistLinks()
  }

  clearLinks = () => {
    this.links = []
  }

  persistLinks = () => {
    chrome.storage.local.set({[this.storage_key]: JSON.stringify(this.links)});
  }

  loadLinks = () => {
    chrome.storage.local.get([this.storage_key], (result) => {
      try {
        const data = JSON.parse(result)
        Array.isArray(data)
        this.links = data
      } catch (e) {
        console.error('unable to load links data', e)
      }
    });
  }

  static init() {
    sdk.links = new LinkList()
    sdk.links.loadLinks()
  }
}

LinkList.init()

const messageHandler = async (request, sender, callback) => {
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
        error(`error on execute method ${request.method} on sdk`, e);
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
