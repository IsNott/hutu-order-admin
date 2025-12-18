import { get, post, put, del } from '@/utils/request'
 export const dictApi = {
  query(data, page, size){
    return post(`/dict/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/dict/detail/${id}`)
  },
  update(id, data){
    return put(`/dict/update/${id}`, data)
  },
  delete(id){
    return del(`/dict/delete/${id}`)
  },
}