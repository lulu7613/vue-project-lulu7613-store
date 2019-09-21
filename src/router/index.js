import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*', // 沒有定義 path 的路徑 (避免用戶進入不存在的頁面)
      redirect: 'login' // 自動導向 login 頁面
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
