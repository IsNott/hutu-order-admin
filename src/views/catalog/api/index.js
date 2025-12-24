import { get, post, put, del } from '@/utils/request'
export const catalogApi = {
  query(data, page, size) {
    return post(`/sysMenuCatalog/page/${page}/${size}`, data)
  },
  add(data) {
    return post(`/sysMenuCatalog/add`, data)
  },
  details(id) {
    return get(`/sysMenuCatalog/details/${id}`)
  },
  update(id, data) {
    return put(`/sysMenuCatalog/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysMenuCatalog/delete/${id}`)
  },
  copy2shop(data){
    return post(`/sysMenuCatalog/copy2Shops`, data)
  }
}