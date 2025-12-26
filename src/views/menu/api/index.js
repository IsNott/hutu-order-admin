import { get, post, put, del } from '@/utils/request'

export const menuApi = {
    queryPage(data, page, size) {
        return post(`/sysMenu/page/${page}/${size}`, data)
    },
    treePage(data, page, size) {
        return post(`/sysMenu/treePage/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysMenu/add`, data)
    },
    details(id) {
        return get(`/sysMenu/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysMenu/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysMenu/delete/${id}`)
    },
}