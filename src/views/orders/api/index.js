import { get, post, put, del } from '@/utils/request'
 export const orderApi = {
  query(data, page, size){
    return post(`/order/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/order/detail/${id}`)
  },
  update(id, data){
    return put(`/order/update/${id}`, data)
  },
  delete(id){
    return del(`/order/delete/${id}`)
  },
}