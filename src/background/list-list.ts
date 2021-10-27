import {ILinkList} from "~/sdk";

export default class LinkList implements ILinkList {
    private links: string[] = []
    private storage_key = 'links_v1'

    getLinks = () => {
        return this.links
    }

    addLink = (link: string) => {
        if (!this.links.includes(link)) {
            this.links.push(link)
        }
        this.persistLinks()
    };

    removeLink = (link: string) => {
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
                const data = JSON.parse(result[this.storage_key])
                Array.isArray(data)
                this.links = data
            } catch (e) {
                console.error('unable to load links data', e)
            }
        });
    }

    static init(): ILinkList {
        const linklist = new LinkList()
        linklist.loadLinks()
        return linklist
    }

    __export_id = "link_list"
}
