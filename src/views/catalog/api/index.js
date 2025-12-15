import { get, post, put, del } from '@/utils/request'
 export const catalogApi = {
  query(data, page, size){
    return post(`/catalog/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/catalog/detail/${id}`)
  },
  update(id, data){
    return put(`/catalog/update/${id}`, data)
  },
  delete(id){
    return del(`/catalog/delete/${id}`)
  },
}