import { get, post, put, del } from '@/utils/request'

export const itemSkuSpecApi = {
  queryPage(data, page, size) {
    return post(`/sysItemSkuSpec/page/${page}/${size}`, data)
  },
  add(data) {
    return post(`/sysItemSkuSpec/add`, data)
  },
  details(id) {
    return get(`/sysItemSkuSpec/details/${id}`)
  },
  update(data) {
    const id = data.id
    return put(`/sysItemSkuSpec/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysItemSkuSpec/delete/${id}`)
  },
}