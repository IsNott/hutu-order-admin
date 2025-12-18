import { get, post, put, del } from '@/utils/request'
 export const homeApi = {
  getInfo(){
    return get('/home/info')
  }
}