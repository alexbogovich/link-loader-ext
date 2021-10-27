import {PromisifyBase, PromisifyMe} from './promisify'

export interface ILinkList extends PromisifyMe {
    getLinks(): string[]
    addLink(link: string): void
    removeLink(link: string): void
    clearLinks(): void
}

export interface SDK {
    links: ILinkList
    dev: boolean
}

export type PromisifiedSDK = PromisifyBase<SDK>
