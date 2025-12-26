import { get, post, put, del } from '@/utils/request'

export const userApi = {
    queryPage(data, page, size) {
        return post(`/sysUser/page/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysUser/add`, data)
    },
    details(id) {
        return get(`/sysUser/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysUser/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysUser/delete/${id}`)
    },
    handleResetPwd(id){
      return put(`/sysUser/resetPassword/${id}`)
    }
}