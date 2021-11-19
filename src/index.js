// import './styles/index.css'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false


const obj = {
    a: 1
}
const obj2 = {
    ...obj,
    b: 2
}

console.log(obj)
console.log(obj2)
console.log(3)

const root = document.createElement('div')
document.body.appendChild(root)
new Vue({
    // router,
    // store,
    render: h => h(App)
//   }).$mount('#app')
  }).$mount(root)