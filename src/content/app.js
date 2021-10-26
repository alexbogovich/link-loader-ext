import '../sdk-proxy-handler'

if (window.location.host === 'market.yandex.ru') {
  let targetNode = document.querySelector('body');
  let config = { childList: true, subtree: true };

  let callback = (mutationsList) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          let el = node.querySelector('img[data-auto=gallery-modal-photo]')
          if (el) {
            console.log("el", el.src)
            sdk.links.addLink(el.src)
          }
        });
      }
    }
  };

  let observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// observer.disconnect();
