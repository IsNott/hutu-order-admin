<!-- components/MainMenu.vue -->
<template>
  <el-menu :default-active="activeMenu" :router="false" :collapse="isCollapse" :unique-opened="uniqueOpened"
    @select="handleMenuSelect" class="main-menu">
    <RecursiveMenu :routes="menuRoutes" @menu-click="handleMenuClick" />
  </el-menu>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecursiveMenu from './RecursiveMenu.vue'

const props = defineProps({
  // 是否折叠
  isCollapse: {
    type: Boolean,
    default: false
  },
  // 是否只保持一个子菜单展开
  uniqueOpened: {
    type: Boolean,
    default: true
  },
  // 自定义路由过滤函数
  routeFilter: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['menu-click'])

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  return route.path
})

// 获取所有路由并转换为菜单需要的格式
const menuRoutes = computed(() => {
  const allRoutes = router.getRoutes()
  console.log('menuRoutes', router.getRoutes());

  const rootRoutes = allRoutes.filter(route => {
    return route.path === '/' ||
      route.meta?.isLayout === true ||
      (route.children && route.children.length > 0 || (route.meta?.hide === undefined || route.meta.hide === false))
  })

  const layoutRoute = rootRoutes.find(r => r.meta?.isLayout === true)
  if (layoutRoute && layoutRoute.children) {
    return layoutRoute.children
  }

  return rootRoutes
})

const handleMenuClick = (event) => {
  emit('menu-click', event)
}

const handleMenuSelect = (index, indexPath) => {
  console.log('菜单选择:', index, indexPath)
}
</script>

<style scoped>
.main-menu {
  border-right: none;
  height: 100%;
}

.main-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>