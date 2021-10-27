import LinkList, { ILinkList } from './list-list';

export interface SDK {
    links: ILinkList
    dev: boolean
}

const sdk: SDK = {
  links: LinkList.init(),
  dev: false,
};

export { sdk };
