import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld' // 移除 vue 預設的頁面
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'
import CustomerOrders from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*', // 沒有定義 path 的路徑 (避免用戶進入不存在的頁面)
      redirect: 'login' // 自動導向 login 頁面
    },
    // {
    // path: '/',
    // name: 'HelloWorld',
    // component: HelloWorld,
    // meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
    // },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      // meta: { requiresAuth: true }, // 導航守衛: 到達這頁面需要授權 (放在子元件 Products 做認證)
      children: [
        {
          path: 'admin/products', // http://localhost:8080/#/admin/products
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
        },
        {
          path: 'admin/orders', // http://localhost:8080/#/admin/orders
          name: 'orders',
          component: Orders,
          meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
        },
        {
          path: 'admin/coupons', // http://localhost:8080/#/admin/coupons
          name: 'coupons',
          component: Coupons,
          meta: { requiresAuth: true } // 導航守衛: 到達這頁面需要授權
        },
        {
          path: 'customer_orders', // http://localhost:8080/#/customer_orders
          name: 'customerOrders',
          component: CustomerOrders
        },
        {
          path: 'customer_checkout/:orderId',
          // http://localhost:8080/#/customer_checkout/:orderId (orderId 必須和 api 參數一致)
          name: 'customerCheckout',
          component: CustomerCheckout
        }

      ]
    },
    // {
    //   path: '/',
    //   name: 'Dashboard',
    //   component: Dashboard,
    //   children: [
    //     {
    //       path: 'customer_orders', // http://localhost:8080/#/customer_orders
    //       name: 'CustomerOrders',
    //       component: CustomerOrders
    //     }
    //   ]
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
