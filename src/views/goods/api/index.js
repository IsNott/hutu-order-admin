import { get, post, put, del } from '@/utils/request'
 export const itemApi = {
  shopCatalogTree(parentId){
    return get(`/item/shopCatalogTree/${parentId}`)
  },
  query(data, page, size){
    return post(`/item/page/${page}/${size}`, data)
  },
  details(id){
    return get(`/item/detail/${id}`)
  },
  update(id, data){
    return put(`/item/update/${id}`, data)
  },
  delete(id){
    return del(`/item/delete/${id}`)
  },
}