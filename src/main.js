import Vue from 'vue'
import App from './App'
import router from './router'
import stylus from './common/stylus/index.styl'
import axios from 'axios'
import '../static/css/reset.css'
// axios.defaults.baseURL = 'https://raw.githubusercontent.com/keepingpace/data/master/mock1.json'
/* eslint-disable no-new */
new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
