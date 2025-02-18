import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import router from "./router/index.js"

new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  router, // 路由挂载全局
  render: h => h(App)
}).$mount('#app')
