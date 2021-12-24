import Vue from 'vue'
import router from './router'
import store from './store'
import Request from '@utils/axios'
import '@styles/tailwind.css'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$request = Request

const root = document.createElement('div')
document.body.appendChild(root)
new Vue({
	router,
	store,
	render: h => h(App)
//   }).$mount('#app')
}).$mount(root)