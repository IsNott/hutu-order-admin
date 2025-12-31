<template>
  <div class="layout-container">
    <div v-if="showNavbar" class="navbar">
      <div class="logo" @click="router.push('/')">
        <img src="/logo.png" alt="logo" fit="cover">
      </div>
      <div class="btns">
        <el-dropdown trigger="hover" placement="bottom-end" @command="handleCommand">
          <div class="user-info">
            <img class="avatar" :src="userInfo.avatarUrl || 'src/assets/img/default.jpg'" alt="userAvatar">
            <div class="username-container" v-if="userInfo.username">
              <span class="username">{{ userInfo.username }}</span>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-button type="text" class="profile-btn">个人中心</el-button>
              </el-dropdown-item>
              <el-dropdown-item command="changePassword">
                <el-button type="text" class="change-password-btn">修改密码</el-button>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <el-button type="text" class="logout-btn">退出登录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="github">
          <a href="https://github.com/Isnott/hutu-order" target="_blank">
            <svg-icon icon-class="github" class="icons" />
          </a>
        </div>
      </div>
    </div>

    <div v-if="showMainContainer" class="main-container">
      <div class="menu">
        <el-menu :default-active="activeMenu" @select="handleSelect" v-loading="loading">
          <RecursiveMenu :menu-items="sortedMenuList" @select="handleSelect" />
        </el-menu>
      </div>

      <div class="content">
        <div class="breadcrumb">
          <el-breadcrumb>
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item">
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="router-view-container">
          <router-view />
        </div>
      </div>
    </div>

    <div v-else class="simple-container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { removeToken, isLoggedIn as checkIsLoggedIn } from '@/utils/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CommonAPI } from '@/api'
import RecursiveMenu from '@/components/RecursiveMenu.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const route = useRoute()
const loggedIn = ref(checkIsLoggedIn())
const breadcrumb = ref([])
const menuList = ref([])
const userInfo = ref({})
const loading = ref(false)

const showNavbar = computed(() => {
  return loggedIn.value && route.path !== '/login'
})

const showMainContainer = computed(() => {
  return loggedIn.value && route.path !== '/login'
})


const sortedMenuList = computed(() => {
  return [...menuList.value].sort((a, b) => a.sort - b.sort)
})

const activeMenu = computed(() => {
  const findMenuIndex = (menus, path, parentIndex = '') => {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i]
      const currentIndex = parentIndex ? `${parentIndex}-${menu.sort}` : `${menu.sort}`

      if (menu.path === path) {
        return currentIndex
      }

      if (menu.children && menu.children.length > 0) {
        const found = findMenuIndex(menu.children, path, currentIndex)
        if (found) return found
      }
    }
    return ''
  }

  return findMenuIndex(menuList.value, route.path)
})

watch(() => route.path, () => {
  updateLoginStatus()
  if (loggedIn.value && route.path !== '/login') {
    updateBreadcrumb()
  }
})

watch(() => loggedIn.value, (newValue) => {
  if (newValue && route.path !== '/login') {
    initUserData()
  }
})

const updateLoginStatus = () => {
  loggedIn.value = checkIsLoggedIn()
}

const initUserData = async () => {
  try {
    loading.value = true
    await Promise.all([queryMenus(), queryUserInfo()])
  } catch (error) {
    console.error('初始化用户数据失败:', error)
  } finally {
    loading.value = false
  }
}

const queryMenus = async () => {
  try {
    const res = await CommonAPI.getMenu()
    if (res.code === 200) {
      menuList.value = res.data
      breadcrumb.value = [menuList.value[0]?.name || '首页']
    }
  } catch (error) {
    console.error('获取菜单失败:', error)
  }
}

const queryUserInfo = async () => {
  try {
    const res = await CommonAPI.getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const updateBreadcrumb = () => {
  if (route.path === '/login') return

  const findBreadcrumb = (menus, path, breadcrumbArray = []) => {
    for (const menu of menus) {
      if (menu.path === path) {
        breadcrumbArray.push(menu.name)
        return breadcrumbArray
      }

      if (menu.children && menu.children.length > 0) {
        const found = findBreadcrumb(menu.children, path, [...breadcrumbArray, menu.name])
        if (found) return found
      }
    }
    return []
  }

  breadcrumb.value = findBreadcrumb(menuList.value, route.path)
}

const handleSelect = (index) => {
  const indexArray = index.split('-').map(i => parseInt(i))

  const findMenuItem = (menuItems, indexes) => {
    if (indexes.length === 0) return null

    const currentIndex = indexes[0]
    const menuItem = menuItems.find(item => item.sort === currentIndex)

    if (!menuItem) return null

    if (indexes.length === 1) {
      return menuItem
    } else if (menuItem.children && menuItem.children.length > 0) {
      return findMenuItem(menuItem.children, indexes.slice(1))
    }

    return null
  }

  const selectedMenuItem = findMenuItem(menuList.value, indexArray)

  if (selectedMenuItem && selectedMenuItem.path) {
    router.push(selectedMenuItem.path)
  }
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeToken()
      updateLoginStatus()
      router.push('/login')
      ElMessage.success('退出成功')
    })
  }
}

onMounted(() => {
  if (loggedIn.value && route.path !== '/login') {
    initUserData()
  }
})
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
  overflow: hidden;

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 24px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #f0f0f0;
    z-index: 100;
    flex-shrink: 0;

    .logo {
      display: flex;
      align-items: center;

      img {
        height: 60px;
        width: auto;
        cursor: pointer;
      }
    }

    .btns {
      display: flex;
      align-items: center;
      gap: 20px;

      .el-dropdown {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .github {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #333;
        font-size: 14px;
        text-decoration: none;

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #f0f0f0;
    margin-right: 6px;
  }

  .user-info {
    align-items: center;
    text-align: center;
    display: flex;
    flex-direction: row;
  }

  .icons {
    font-size: 16px;
    position: static;
    display: block;
    width: 32px;
    height: 32px;
  }

  .main-container {
    flex: 1;
    display: flex;
    overflow: hidden;

    .menu {
      width: 220px;
      background: #1869ff;
      border-right: 1px solid #f0f0f0;
      overflow-y: auto;
      flex-shrink: 0;

      .el-menu {
        height: 100%;
        border-right: none;

        :deep(.el-menu-item) {
          height: 50px;
          line-height: 50px;

          &:hover {
            background-color: #f5f7fa;
          }

          &.is-active {
            background-color: #e6f7ff;
            color: #1890ff;
            border-right: 3px solid #1890ff;
          }
        }

        :deep(.el-sub-menu) {
          .el-sub-menu__title {
            height: 50px;
            line-height: 50px;

            &:hover {
              background-color: #f5f7fa;
            }
          }

          .el-menu-item {
            height: 44px;
            line-height: 44px;
            min-width: 0;
            padding-left: 50px !important;

            &:hover {
              background-color: #f5f7fa;
            }

            &.is-active {
              background-color: #e6f7ff;
              color: #1890ff;
            }
          }
        }
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .breadcrumb {
        padding: 8px;
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;

        .el-breadcrumb {
          font-size: 14px;

          :deep(.el-breadcrumb__item:last-child) {
            .el-breadcrumb__inner {
              color: #1890ff;
              font-weight: 500;
            }
          }
        }
      }

      .router-view-container {
        flex: 1;
        padding: 24px;
        overflow: auto;
      }
    }
  }

  .simple-container {
    flex: 1;
    overflow: auto;
  }
}

.sidebar {
  width: 220px;
  transition: width 0.3s;
  // background: #001529;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 64px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .layout-container {
    .main-container {
      .menu {
        width: 180px;
      }
    }
  }
}
</style>