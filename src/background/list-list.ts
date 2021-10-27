import { PromisifyMe } from '../shared/psdk';

export interface ILinkList extends PromisifyMe {
    getLinks(): string[]
    addLink(link: string): void
    removeLink(link: string): void
    clearLinks(): void
}

export default class LinkList implements ILinkList {
    private links: string[] = []

    private storageKey = 'links_v1'

    getLinks = () => this.links

    addLink = (link: string) => {
      if (!this.links.includes(link)) {
        this.links.push(link);
      }
      this.persistLinks();
    };

    removeLink = (link: string) => {
      this.links = this.links.filter(l => l !== link);
      this.persistLinks();
    }

    clearLinks = () => {
      this.links = [];
    }

    persistLinks = () => {
      chrome.storage.local.set({ [this.storageKey]: JSON.stringify(this.links) });
    }

    loadLinks = () => {
      chrome.storage.local.get([this.storageKey], result => {
        try {
          const data = JSON.parse(result[this.storageKey]);
          Array.isArray(data);
          this.links = data;
        } catch (e) {
          console.error('unable to load links data', e);
        }
      });
    }

    static init(): ILinkList {
      const linklist = new LinkList();
      linklist.loadLinks();
      return linklist;
    }

    PROMISIFY_EXPORT_ID = 'link_list'
}
