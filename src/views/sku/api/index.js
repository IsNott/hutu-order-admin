import { get, post, put, del } from '@/utils/request'
export const skuApi = {
  queryPage(data, page, size){
    return post(`/sku/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/sku/detail/${id}`)
  },
  update(id, data){
    return put(`/sku/update/${id}`, data)
  },
  delete(id){
    return del(`/sku/delete/${id}`)
  },
}