import { get, post, put, del } from '@/utils/request'
import { indexContent } from '@/api/index'
export const storeApi = {
  quertStroePage(data, page, size) {
    return post(`/sysShopInfo/page/${page}/${size}`, data)
  },
  add(data) {
    return post(`/sysShopInfo/add`, data)
  },
  details(id) {
    return get(`/sysShopInfo/details/${id}`)
  },
  update(data) {
    const id = data.id
    return put(`/sysShopInfo/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysShopInfo/delete/${id}`)
  },
}