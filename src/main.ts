import './styles/tailwind/index.css'
// import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate); // <- aktifkan persist untuk semua store yg di-enable

app.use(pinia)
app.use(router)
app.mount('#app')