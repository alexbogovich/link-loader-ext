import { createApp } from 'vue';
import Popup from './Popup.vue';

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(Popup);
  app.mount('#app');
});
