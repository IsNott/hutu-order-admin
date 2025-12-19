<template>
  <div id="app">
    <div class="navbar" v-if="showNavbar">
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

    <div class="main-container" v-if="showMainContainer">
      <div class="menu">
        <el-menu :default-active="'1'" @select="handleSelect">
          <RecursiveMenu :menu-items="sortedMenuList" @select="handleSelect" />
        </el-menu>
      </div>

      <div class="content">
        <div class="breadcrumb">
          <el-breadcrumb>
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="router-view-container">
          <router-view />
        </div>
      </div>
    </div>

    <div class="simple-container" v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { removeToken, isLoggedIn as checkIsLoggedIn } from './utils/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CommonAPI } from './api'
import RecursiveMenu from './components/RecursiveMenu.vue'
import SvgIcon from '@/components/SvgIcon.vue'
// Data
const router = useRouter()
const route = useRoute()
const loggedIn = ref(false)
const breadcrumb = ref([])
const menuList = ref([])
const userInfo = ref({})

const showNavbar = computed(() => {
  return loggedIn.value && route.path !== '/login'
})

const showMainContainer = computed(() => {
  return loggedIn.value && route.path !== '/login'
})

const sortedMenuList = computed(() => {
  return [...menuList.value].sort((a, b) => a.index - b.index)
})


// 监听路由变化
watch(() => route.path, (newPath) => {
  updateLoginStatus() // 路由变化时更新登录状态
  checkLoginStatus()
})

watch(() => loggedIn.value, (newValue) => {
  if (newValue) {

  }
})

// Emits
const emit = defineEmits([])

// Props
const props = defineProps({})

// Lifecycle hooks
onMounted(() => {
  checkLoginStatus()
  setTimeout(() => {
    queryMenus()
    queryUserInfo()
  }, 200)
})

const updateLoginStatus = () => {
  loggedIn.value = checkIsLoggedIn()
}


const checkLoginStatus = () => {
  console.log('checkLoginStatus')
  updateLoginStatus()

  if (!loggedIn.value && route.path !== '/login') {
    router.push('/login')
  }

  if (loggedIn.value && route.path === '/login') {
    router.push('/home')
  }
}

// Methods
const queryMenus = () => {
  console.log('queryMenus');
  CommonAPI.getMenu().then(res => {
    if (res.code === 200) {
      menuList.value = res.data
      console.log(res.data)
      breadcrumb.value = [menuList.value[0].name]
    }
  })
}

const queryUserInfo = () => {
  console.log('queryUserInfo');
  CommonAPI.getUserInfo().then(res => {
    if (res.code === 200) {
      console.log(res.data)
      userInfo.value = res.data
    }
  })
}

const handleSelect = (index) => {
  const indexArray = index.split('-').map(i => parseInt(i))

  const findMenuItem = (menuItems, indexes) => {
    if (indexes.length === 0) return null

    const currentIndex = indexes[0]
    const menuItem = menuItems.find(item => item.index === currentIndex)

    if (!menuItem) return null

    if (indexes.length === 1) {
      return menuItem
    } else if (menuItem.children && menuItem.children.length > 0) {
      return findMenuItem(menuItem.children, indexes.slice(1))
    }

    return null
  }

  const selectedMenuItem = findMenuItem(menuList.value, indexArray)

  if (selectedMenuItem) {
    // 更新面包屑
    const updateBreadcrumb = (menuItems, indexes, breadcrumbArray = []) => {
      if (indexes.length === 0) return breadcrumbArray

      const currentIndex = indexes[0]
      const menuItem = menuItems.find(item => item.index === currentIndex)

      if (menuItem) {
        breadcrumbArray.push(menuItem.name)

        if (indexes.length > 1 && menuItem.children) {
          return updateBreadcrumb(menuItem.children, indexes.slice(1), breadcrumbArray)
        }
      }

      return breadcrumbArray
    }

    breadcrumb.value = updateBreadcrumb(menuList.value, indexArray)

    if (selectedMenuItem.path) {
      router.push(selectedMenuItem.path)
    } else {
      console.warn('菜单项没有配置路径:', selectedMenuItem)
    }
  } else {
    console.warn('未找到对应的菜单项，索引:', index)
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

</script>

<style scoped lang="scss">


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

      .el-dropdown-link {
        display: flex;
        align-items: center;
        gap: 8px;

        .username {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .github {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #333;
      font-size: 14px;
      text-decoration: none;

      .el-icon {
        font-size: 20px;
      }

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
    // overflow: auto;
  }
}

/* 简化容器：用于登录页面等 */
.simple-container {
  height: 100vh;
  width: 100vw;
}

/* 主容器布局 - 使用flex布局 */
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  >.navbar {
    flex-shrink: 0;
  }

  >.main-container {
    flex: 1;
    display: flex;
    overflow: hidden;

    >.menu {
      height: 100%;
    }

    >.content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .menu {
    width: 180px;
  }
}
</style>