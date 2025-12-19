import { get, post, put, del } from '@/utils/request'
import { indexContent } from '@/api/index'
export const storeApi = {
  quertStroePage(data, page, size) {
    return post(`/sysShopInfo/page/${page}/${size}`, data)
  },
  details(id) {
    return get(`/sysShopInfo/detail/${id}`)
  },
  update(id, data) {
    return put(`/sysShopInfo/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysShopInfo/delete/${id}`)
  },
}