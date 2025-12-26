import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth.js'
import Layout from '@/views/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      noLayout: true,
      hide: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '404',
      noLayout: true,
      requiresAuth: false,
      hide: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '404',
      noLayout: true,
      hide: true
    }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'home'
        }
      },
      {
        path: 'store',
        name: 'store',
        component: () => import('@/views/store/index.vue'),
        meta: {
          title: '门店管理',
          icon: 'shop'
        }
      },
      {
        path: '/system',
        name: 'system-management',
        meta: {
          title: '系统管理',
          icon: 'setting'
        },
        children: [
          {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user'
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'team'
        }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'safety-certificate'
        }
      },
        ]
      },
      {
        path: 'sku',
        name: 'sku',
        component: () => import('@/views/sku/index.vue'),
        meta: {
          title: 'SKU管理',
          icon: 'appstore'
        }
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/goods/index.vue'),
        meta: {
          title: '商品管理',
          icon: 'gift'
        }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/orders/index.vue'),
        meta: {
          title: '订单管理',
          icon: 'solution'
        }
      },
      {
        path: 'playImage',
        name: 'play-image',
        component: () => import('@/views/play-image/index.vue'),
        meta: {
          title: '轮播图管理',
          icon: 'picture'
        }
      },
      {
        path: 'catalog',
        name: 'catalog',
        component: () => import('@/views/catalog/index.vue'),
        meta: {
          title: '分类管理',
          icon: 'cluster'
        }
      },
      {
        path: 'dict',
        name: 'dict',
        component: () => import('@/views/data-dict/index.vue'),
        meta: {
          title: '字典管理',
          icon: 'book'
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - hutu-admin`
  }

  if(!router.hasRoute(to.name)){
    next('/404')
    return
  }
  
  // 登录页面直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检查登录状态
  if (!isLoggedIn() && to.meta.requiresAuth) {
    next('/login')
    return
  }
  
  next()
})

export default router