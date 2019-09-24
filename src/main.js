// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios' // 主要的 AJAX 套件
import VueAxios from 'vue-axios' // 將 AJAX 轉為 Vue 的套件
import Loading from 'vue-loading-overlay' // vue-loading-overlay 套件
import 'vue-loading-overlay/dist/vue-loading.css' // vue-loading-overlay CSS 套件

import App from './App'
import router from './router'
import './bus' // event bus 的設定檔

Vue.use(VueAxios, axios) // 執行 axios 套件
Vue.component('Loading', Loading) // 執行 vue-loading-overlay 套件，使用 Vue.use(Loading) 也可
Vue.config.productionTip = false
axios.defaults.withCredentials = true // 當 API 需要經過 admin 時，需加上這行

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 導航守衛 (切換頁面時觸發: 判斷是否需要驗證，才能跳轉頁面，常用在檢查用戶是否仍在登入狀態)
router.beforeEach((to, from, next) => {
  // to -即將要到的頁面，
  // from -從哪個頁面過來
  // next -next() 執行方法
  // 透過 to(前往特定頁面)的 meta 內的 requiresAuth 值判定是否需要驗證，若需要在呼叫 API 並透過 next( )切換頁面
  // meta 寫在 index.js 的 routes 需認證的元件中
  console.log('to', to, 'from', from, 'next', next)

  // 檢查用戶是否仍在登入狀態
  // 如果 requiresAuth 為 true，需要做登入驗證
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`
    axios.post(api).then((response) => { // 這邊不是元件，不使用 this.$http
      console.log(response.data)
      if (response.data.success) { // 如果驗證為 true
        next() // 進入 to
      } else { // 如果驗證為 false
        next('/login') // 留在 login 頁面
      }
    })
  } else {
    next() // 沒有設定 meta: { requiresAuth: true } 的頁面直接進入 to
  }
})
