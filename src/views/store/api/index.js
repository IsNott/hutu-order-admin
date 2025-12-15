import { get, post, put, del } from '@/utils/request'
import { indexContent } from '@/api/index'
export const storeApi = {
  quertStroePage(data, page, size){
    return post(`/store/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/store/detail/${id}`)
  },
  update(id, data){
    return put(`/store/update/${id}`, data)
  },
  delete(id){
    return del(`/store/delete/${id}`)
  },
}