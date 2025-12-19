import { get, post, put, del } from '@/utils/request'
export const indexContent = "hutu-admin"
export const CommonAPI = {
  getUserInfo() {
    return post(`/auth/info`)

  },
  getMenu() {
    return get(`/menu`)
  },
  login(data) {
    return post(`/auth/login`, data)
  },
}

