import { get, post, put, del } from '@/utils/request'

export const itemSkuOptionApi = {
    queryPage(data, page, size) {
        return post(`/sysItemSkuOption/page/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysItemSkuOption/add`, data)
    },
    details(id) {
        return get(`/sysItemSkuOption/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysItemSkuOption/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysItemSkuOption/delete/${id}`)
    },
}