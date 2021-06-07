import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-ui
import './plugins/element.js'

Vue.config.productionTip = false;

// import { Button } from 'element-ui'
// Vue.use(Button)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
