import { createApp } from 'vue'
import '@styles/tailwind.css'
import router from './router'
import store from './store'

import App from './App.vue'

const root = document.createElement('div')
document.body.appendChild(root)
createApp(App).use(router).use(store).mount(root)
