import { get, post, put, del } from '@/utils/request'

export const roleMenuApi = {
  queryPage(data, page, size) {
    return post(`/sysRoleMenu/page/${page}/${size}`, data)
  },
  queryByRoleId(roleId) {
    return get(`/sysRoleMenu/queryByRoleId/${roleId}`)
  },
  add(data) {
    return post(`/sysRoleMenu/add`, data)
  },
  details(id) {
    return get(`/sysRoleMenu/details/${id}`)
  },
  update(data) {
    const id = data.id
    return put(`/sysRoleMenu/update/${id}`, data)
  },
  delete(id) {
    return del(`/sysRoleMenu/delete/${id}`)
  },

  setRoleMenus(roleId, menuIds) {
    return post(`/sysRoleMenu/setRoleMenus/${roleId}`, menuIds)
  }
}