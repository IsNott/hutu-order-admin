import { get, post, put, del } from '@/utils/request'

export const userRoleApi = {
    queryPage(data, page, size) {
        return post(`/sysUserRole/page/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysUserRole/add`, data)
    },
    details(id) {
        return get(`/sysUserRole/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysUserRole/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysUserRole/delete/${id}`)
    },
}