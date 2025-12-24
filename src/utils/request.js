import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken, removeToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = getToken()

    if (token) {
      config.headers['token'] = token
    } else {
      if (!router.currentRoute.value.path.includes('/login')) {
        // 如果没有token，跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('未登录或token已过期'))
      }
    }

    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // HTTP状态码为200
    const res = response.data

    // 根据你的后端返回结构判断
    if (res.code === 200) {
      return res // 返回数据
    } else if (res.code === 401 || res.code === 403) {
      // 未授权或token过期
      ElMessage.error(res.message || '登录已过期，请重新登录')
      removeToken() // 清除token
      router.push('/login')
      return Promise.reject(new Error(res.message || '未授权'))
    } else if (res.code === 500) {
      // 服务器错误
      ElMessage.error(res.message || '服务器错误')
      return Promise.reject(new Error(res.message || '服务器错误'))
    } else {
      // 其他错误码
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    // HTTP状态码不为200的情况
    console.error('响应错误:', error)
    if (error.response) {
      const status = error.response.status
      if (status === 401 || status === 403) {
        ElMessage.error('登录已过期，请重新登录')
        removeToken()
        router.push('/login')
      } else if (status === 500) {
        ElMessage.error('服务器错误')
      } else {
        ElMessage.error(error.response.data.message || '请求失败')
      }
    }
    return Promise.reject(error)
  }
)

// 封装GET请求
export function get(url, params = {}, config = {}) {
  return service({
    url,
    method: 'GET',
    params,
    ...config
  })
}

// 封装POST请求
export function post(url, data = {}, config = {}) {
  return service({
    url,
    method: 'POST',
    data,
    ...config
  })
}

// 封装PUT请求
export function put(url, data = {}, config = {}) {
  return service({
    url,
    method: 'PUT',
    data,
    ...config
  })
}

// 封装DELETE请求
export function del(url, params = {}, config = {}) {
  return service({
    url,
    method: 'DELETE',
    params,
    ...config
  })
}

export default service