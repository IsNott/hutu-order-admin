import { get, post, put, del } from '@/utils/request'
 export const imageApi = {
  queryPage(data, page, size){
    return post(`/image/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/image/detail/${id}`)
  },
  update(id, data){
    return put(`/image/update/${id}`, data)
  },
  delete(id){
    return del(`/image/delete/${id}`)
  },
}