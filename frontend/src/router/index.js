import { createRouter, createWebHistory } from 'vue-router'

import MainView from '@/views/MainView.vue'

import HomeView from '@/views/pages/HomeView.vue'
import ProductView from '@/views/pages/ProductView.vue'
import PostView from '@/views/pages/PostView.vue'
import AdminView from '@/views/pages/AdminView.vue'
import CartView from '@/views/pages/CartView.vue'
import UserView from '@/views/pages/UserView.vue'

import UsersView from '@/views/adminpages/UsersView.vue'
import DatabaseView from '@/views/adminpages/ItemsView.vue'
import OrdersView from '@/views/adminpages/OrdersView.vue'
import CartsView from '@/views/adminpages/CartsView.vue'
import StatisticsView from '@/views/adminpages/StatisticsView.vue'
import SettingsView from '@/views/adminpages/SettingsView.vue'

import RegisterView from '@/views/user/RegisterView.vue'
import LogInView from '@/views/user/LogInView.vue'
import ForgotPasswordView from '@/views/user/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/user/ResetPasswordView.vue'

const routes = [
  { path: '/user',
    children: [
      { path: 'login', component: LogInView },
      { path: 'register', component: RegisterView },
      { path: 'forgot-password', component: ForgotPasswordView },
      { path: 'reset-password', component: ResetPasswordView },
    ]
   },
  {
    path: '/', component: MainView, redirect: '/product',
    children: [
      // { path: '', component: HomeView },
      { path: 'product', component: ProductView },
      { path: 'post', component: PostView },
      { path: 'cart', component: CartView },
      { path: 'user', component: UserView },
      {
        path: 'admin', component: AdminView,
        children: [
          { path: 'users', component: UsersView },
          { path: 'items', component: DatabaseView },
          { path: 'orders', component: OrdersView },
          { path: 'carts', component: CartsView },
          { path: 'statistics', component: StatisticsView },
          { path: 'settings', component: SettingsView },
        ]
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router