import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth.js'
import Layout from '@/views/layout/index.vue'
import { CommonAPI } from '@/api'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      noLayout: true,
      visible: false
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
      visible: false
    }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: { requiresAuth: true },
    children: []
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

let dynamicRoutesLoaded = false
let loadingPromise = null

let dynamicRoutes = []

const createRouteFromMenuItem = (item) => {
  const componentPath = item.component.split('/')
  let component = ''
  if (componentPath.length == 3) {
    component = () => import(`../views/${componentPath[1]}/${componentPath[2]}.vue`)
  } else if (componentPath.length == 1 && componentPath[0] !== '') {
    component = () => import(`../views/${componentPath[0]}.vue`)
  }
  const route = {
    path: item.path,
    name: item.name,
    component: component,
    meta: {
      title: item.title,
      icon: item.icon,
      requiresAuth: true,
      visible: item.visible,
      permission: item.permission,
      type: item.type
    }
  }

  if (item.children && item.children.length > 0) {
    route.children = item.children.map(child => createRouteFromMenuItem(child))
  }

  return route
}

const addDynamicRoutes = async () => {
  const res = await CommonAPI.getMenu()
  if (res.code === 200) {
    dynamicRoutes = []

    res.data.forEach(item => {
      const route = createRouteFromMenuItem(item)
      router.addRoute('layout', route)
      dynamicRoutes.push(route)
    })

    dynamicRoutesLoaded = true

  }
}

const loadDynamicRoutes = async () => {
  if (dynamicRoutesLoaded) {
    return true
  }

  if (!loadingPromise) {
    loadingPromise = addDynamicRoutes()
  }

  await loadingPromise
  return true
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - hutu-admin`
  }

  if (to.path === '/login') {
    next()
    return
  }

  if (!isLoggedIn() && to.meta.requiresAuth !== false) {
    next('/login')
    return
  }

  if (isLoggedIn()) {
    if (!dynamicRoutesLoaded) {
      await loadDynamicRoutes()
      next(to.path)
    }
    const currentRouteMatched = to.matched.length > 0

    if (!currentRouteMatched && to.path !== '/404') {
      next('/404')
      return
    }
  }

  if (to.path === '/') {
    next('/home')
    return
  }

  next()
})

if (isLoggedIn()) {
  loadDynamicRoutes()
}

export default router