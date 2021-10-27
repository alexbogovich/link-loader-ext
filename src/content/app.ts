import {psdk} from "~/shared/psdk";

const yandexMarketObserver = () => {
  const targetNode = document.querySelector<HTMLBodyElement>('body');
  if (!targetNode) {
    return
  }
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          const src = (node as HTMLElement).querySelector<HTMLImageElement>("img[data-auto=gallery-modal-photo]")?.src
          if (src) {
            console.log("el", src)
            psdk.links.addLink(src)
          }
        });
      }
    }
  });
  observer.observe(targetNode, config);
}

if (window.location.host === 'market.yandex.ru') {
 yandexMarketObserver()
}
