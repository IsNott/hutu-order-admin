<!-- components/RecursiveMenu.vue -->
<template>
  <template v-for="route in filteredRoutes" :key="route.path">
    <!-- 单个菜单项（没有子路由或子路由不显示在菜单中） -->
    <el-menu-item v-if="shouldRenderAsMenuItem(route)" :index="route.path" @click="handleMenuItemClick(route)">
      <template #title>
        <!-- 图标显示 -->
        <div class="menu-item-content">
          <svg-icon v-if="route.meta?.icon" :icon-class="route.meta.icon" />
          <component v-else-if="route.meta?.iconComponent" :is="route.meta.iconComponent" />
          <span class="menu-title">{{ route.meta?.title || route.name }}</span>
        </div>
      </template>
    </el-menu-item>

    <!-- 子菜单项（有子路由且至少一个子路由显示在菜单中） -->
    <el-sub-menu v-else-if="shouldRenderAsSubMenu(route)" :index="route.path">
      <template #title>
        <div class="submenu-title-content">
          <svg-icon v-if="route.meta?.icon" :icon-class="route.meta.icon" />
          <component v-else-if="route.meta?.iconComponent" :is="route.meta.iconComponent" />
          <span class="menu-title">{{ route.meta?.title || route.name }}</span>
        </div>
      </template>
      <!-- 递归渲染子路由 -->
      <RecursiveMenu :routes="route.children" :parent-path="route.path" @menu-click="handleMenuClick" />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 路由列表
  routes: {
    type: Array,
    default: () => []
  },
  // 父级路由路径（用于构建完整的路径）
  parentPath: {
    type: String,
    default: ''
  },
  // 是否只显示有权限的路由
  checkPermission: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['menu-click'])

const router = useRouter()

// 获取当前用户权限（根据你的权限系统实现）
const userPermissions = computed(() => {
  // 这里需要根据你的权限系统获取当前用户的权限
  // 例如：从 Vuex/Pinia store 或 localStorage 获取
  return JSON.parse(localStorage.getItem('userPermissions') || '[]')
})

// 过滤路由，只显示应该在菜单中显示的路由
const filteredRoutes = computed(() => {
  if (!props.routes || props.routes.length === 0) {
    const allRoutes = router.getRoutes()
    return filterRoutes(allRoutes, '')
  }

  return filterRoutes(props.routes, props.parentPath)
})

// 过滤路由的核心函数
const filterRoutes = (routes, basePath) => {
  return routes.filter(route => {
    // 1. 检查是否隐藏（meta.hidden）
    if (route.meta?.hidden === true) {
      return false
    }

    // 2. 检查是否显示在菜单中（默认显示）
    if (route.meta?.showInMenu === false) {
      return false
    }

    // 3. 检查权限
    if (props.checkPermission && route.meta?.permission) {
      const hasPermission = userPermissions.value.includes(route.meta.permission)
      if (!hasPermission) {
        return false
      }
    }

    // 4. 确保路由有标题或名称
    if (!route.meta?.title && !route.name) {
      console.warn(`路由 ${route.path} 没有设置title和name，将被过滤`)
      return false
    }

    return true
  }).sort((a, b) => {
    // 根据meta中的order排序（默认0）
    const orderA = a.meta?.order || 0
    const orderB = b.meta?.order || 0
    return orderA - orderB
  })
}

// 判断是否应该渲染为菜单项（没有子路由或所有子路由都不显示）
const shouldRenderAsMenuItem = (route) => {
  // 如果没有children，直接是菜单项
  if (!route.children || route.children.length === 0) {
    return true
  }

  // 如果有children，但所有子路由都不显示在菜单中
  const visibleChildren = route.children.filter(child => {
    // 检查子路由是否显示
    return !child.meta?.hidden &&
      child.meta?.showInMenu !== false &&
      (!props.checkPermission || !child.meta?.permission ||
        userPermissions.value.includes(child.meta.permission))
  })

  return visibleChildren.length === 0
}

// 判断是否应该渲染为子菜单
const shouldRenderAsSubMenu = (route) => {
  // 有children且至少有一个子路由要显示
  if (!route.children || route.children.length === 0) {
    return false
  }

  const visibleChildren = route.children.filter(child => {
    return !child.meta?.hidden &&
      child.meta?.showInMenu !== false &&
      (!props.checkPermission || !child.meta?.permission ||
        userPermissions.value.includes(child.meta.permission))
  })

  return visibleChildren.length > 0
}

// 获取完整的路由路径
const getFullPath = (route, parentPath = '') => {
  if (route.path.startsWith('/')) {
    return route.path
  }

  if (parentPath) {
    return `${parentPath.replace(/\/$/, '')}/${route.path.replace(/^\//, '')}`
  }

  return `/${route.path}`
}

// 菜单项点击事件
const handleMenuItemClick = (route) => {
  const fullPath = getFullPath(route, props.parentPath)
  emit('menu-click', {
    route,
    path: fullPath,
    meta: route.meta
  })

  // 如果路由有重定向，使用重定向路径
  const targetPath = route.redirect || fullPath

  // 导航到目标路由
  router.push(targetPath)
}

// 向上传递点击事件
const handleMenuClick = (event) => {
  emit('menu-click', event)
}
</script>

<style scoped>
.menu-item-content,
.submenu-title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 确保图标大小一致 */
.svg-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>