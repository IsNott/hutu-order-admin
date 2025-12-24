import { get, post, put, del } from '@/utils/request'
export const itemApi = {
  shopCatalogTree(parentId) {
    return get(`/sysProduct/shopCatalogTree/${parentId}`)
  },
  query(data, page, size) {
    return post(`/sysProduct/page/${page}/${size}`, data)
  },
  details(id) {
    return get(`/sysProduct/details/${id}`)
  },
  update(data) {
    return put(`/sysProduct/update/${data.id}`, data)
  },
  delete(id) {
    return del(`/sysProduct/delete/${id}`)
  },
  add(data) {
    return post(`/sysProduct/add`, data)
  },
}