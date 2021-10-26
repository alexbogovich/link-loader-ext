import { createApp } from 'vue'
import '../sdk-proxy-handler'
import App from './App.vue'


document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(App)
  global.$vm = app.mount('#app')
});
