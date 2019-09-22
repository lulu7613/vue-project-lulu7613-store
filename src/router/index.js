import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'

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
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      // meta: { requiresAuth: true }, // 導航守衛: 到達這頁面需要授權 (放在子元件 Products 做認證)
      children: [
        {
          path: 'products', // http://localhost:8080/#/admin/products
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
