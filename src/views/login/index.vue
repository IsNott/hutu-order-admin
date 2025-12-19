<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" 
      label-position="left">

      <div class="title-container">
        <text class="title">Hutu-Order管理后台</text>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <el-icon><User /></el-icon>
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text"
          tabindex="1" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <el-icon><Lock /></el-icon>
        </span>
        <el-input 
          :key="passwordType" 
          ref="password" 
          v-model="loginForm.password" 
          :type="passwordType"
          placeholder="请输入密码" 
          name="password" 
          tabindex="2"
          @keyup.enter="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <el-icon>
            <View v-if="passwordType === 'text'" />
            <Hide v-else />
          </el-icon>
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { getToken, setToken } from '@/utils/auth'
import { CommonAPI as loginApi } from '@/api'
const router = useRouter()

// Data
const redirect = ref('/')
const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
}

const passwordType = ref('password')
const loading = ref(false)
const loginFormRef = ref()

// Methods
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

const handleLogin = () => {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      loginApi.login(loginForm.value).then(res => {
          if (res.code !== 200) {
            ElMessage.error('登录失败: ' + res.message)
            return
          }
          setToken(res.data)
          router.push(redirect.value)
          ElMessage.success('登录成功')
        }).finally(() => {
          loading.value = false
        })
    } else {
      ElMessage.error('请填写完整的登录信息')
      return false
    }
  })
}

// Lifecycle hooks
onMounted(() => {
  redirect.value = router.currentRoute?.query?.redirect || '/'
  
  const token = getToken()
  if (token) {
    setTimeout(() => {
      router.push(redirect.value)
    }, 100)

  }
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #417cb1;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
  }

  .login-form {
    position: relative;
    width: 100%;
    max-width: 420px;
    padding: 50px 40px;
    margin: 0 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    z-index: 1;
    
    &:hover {
      transform: translateY(-5px);
      transition: transform 0.3s ease;
    }
  }

  .title-container {
    position: relative;
    margin-bottom: 40px;
    text-align: center;
    .title {
      font-size: 22px;
      color: #333;
      margin: 0;
      font-weight: 600;
      background: rgb(49, 49, 49);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  // 表单项样式
  :deep(.el-form-item) {
    margin-bottom: 30px;
    
    &.is-error {
      .el-input__wrapper {
        border-color: #f56c6c;
        box-shadow: 0 0 0 1px rgba(245, 108, 108, 0.2);
      }
    }
  }

  // 输入框样式
  :deep(.el-input__wrapper) {
    height: 48px;
    padding-left: 45px;
    border-radius: 8px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &:hover {
      border-color: #c0c4cc;
      background: #fff;
    }
    
    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      background: #fff;
    }
  }

  :deep(.el-input__inner) {
    height: 100%;
    font-size: 15px;
    color: #333;
    
    &::placeholder {
      color: #a0a0a0;
    }
  }

  .svg-container {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 18px;
      color: #6c757d;
    }
  }

  .show-pwd {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    .el-icon {
      font-size: 18px;
      color: #6c757d;
      
      &:hover {
        color: #409eff;
      }
    }
  }

  // 登录按钮样式
  :deep(.el-button) {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &.is-loading {
      opacity: 0.8;
    }
  }

  // 响应式调整
  @media (max-width: 480px) {
    .login-form {
      padding: 40px 25px;
      margin: 0 15px;
    }
    
    .title-container .title {
      font-size: 24px;
    }
    
    :deep(.el-input__wrapper) {
      height: 44px;
    }
    
    :deep(.el-button) {
      height: 44px;
    }
  }
  
  @media (max-width: 360px) {
    .login-form {
      padding: 35px 20px;
    }
    
    .title-container .title {
      font-size: 22px;
    }
  }
}
</style>