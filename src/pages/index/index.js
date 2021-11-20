import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const root = document.createElement('div')
document.body.appendChild(root)
new Vue({
    // router,
    // store,
    render: h => h(App)
//   }).$mount('#app')
}).$mount(root)