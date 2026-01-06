import { get, post, put, del } from '@/utils/request'

export const slideShowApi = {
    queryAll(data) {
        return post(`/sysSlideShow/queryAll`, data)
    },
    queryPage(data, page, size) {
        return post(`/sysSlideShow/page/${page}/${size}`, data)
    },
    add(data) {
        return post(`/sysSlideShow/add`, data)
    },
    details(id) {
        return get(`/sysSlideShow/details/${id}`)
    },
    update(data) {
        const id = data.id
        return put(`/sysSlideShow/update/${id}`, data)
    },
    delete(id) {
        return del(`/sysSlideShow/delete/${id}`)
    },
}