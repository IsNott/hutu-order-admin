import { get, post, put, del } from '@/utils/request'

export const roleApi = {
    queryPage(data, page, size) {
        return post(`/sysRole/page/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysRole/add`, data)
    },
    details(id) {
        return get(`/sysRole/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysRole/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysRole/delete/${id}`)
    },
}