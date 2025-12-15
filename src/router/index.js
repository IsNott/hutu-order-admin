import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth.js'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404',
    },
    component: () => import('@/views/error-page/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/404',
  },
  {
    path: '/store',
    name: 'store',
    meta: {
      title: '门店管理',
    },
    component: () => import('@/views/store/index.vue'),
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      title: '用户管理',
    },
    component: () => import('@/views/user/index.vue'),
  },
  {
    path: '/role',
    name: 'role',
    meta: {
      title: '角色管理',
    },
    component: () => import('@/views/role/index.vue'),
  },
  {
    path: '/permission',
    name: 'permission',
    meta: {
      title: '权限管理',
    },
    component: () => import('@/views/permission/index.vue'),
  },
  {
    path: '/sku',
    name: 'sku',
    meta: {
      title: 'SKU管理',
    },
    component: () => import('@/views/sku/index.vue'),
  },
  {
    path: '/goods',
    name: 'goods',
    meta: {
      title: '商品管理',
    },
    component: () => import('@/views/goods/index.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    meta: {
      title: '订单管理',
    },
    component: () => import('@/views/orders/index.vue'),
  },
  {
    path: '/playImage',
    name: 'play-image',
    meta: {
      title: '轮播图管理',
    },
    component: () => import('@/views/play-image/index.vue'),
  },
  {
    path: '/catalog',
    name: 'catalog',
    meta: {
      title: '分类管理',
    },
    component: () => import('@/views/catalog/index.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (isLoggedIn()) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from) => {
  console.log(`从 ${from.path} 跳转到 ${to.path}`)
  document.title = to.meta.title || 'hutu-admin'
  // if(!routes.find(route => route.path === to.path)){
  //   router.push('/404')
  // }
})

export default router
