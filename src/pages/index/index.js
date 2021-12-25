import '@styles/tailwind.css'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import store from './store'

const root = document.createElement('div')
document.body.appendChild(root)
createApp(App).use(router).use(store).mount(root)
