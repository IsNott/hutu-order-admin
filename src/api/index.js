import { get, post, put, del } from '@/utils/request'
export const indexContent = "hutu-admin"
export const CommonAPI = {
  getUserInfo(){
    return get(`/user/info`)
    
  },
  getMenu(){
    return get(`/menu`)
  },
  login(data){
    return post(`/login`, data)
  },
}

