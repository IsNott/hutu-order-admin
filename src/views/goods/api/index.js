import { get, post, put, del } from '@/utils/request'
export const itemApi = {
  shopCatalogTree(parentId) {
    return get(`/sysProduct/shopCatalogTree/${parentId}`)
  },
  query(data, page, size) {
    return post(`/sysProduct/page/${page}/${size}`, data)
  },
  details(id) {
    return get(`/sysProduct/detail/${id}`)
  },
  update(id, data) {
    return put(`/sysProduct/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysProduct/delete/${id}`)
  },
}