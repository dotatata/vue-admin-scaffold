import request from '@/utils/request'

export function fetchRoleList(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function fetchRoles(query) {
  return request({
    url: '/role/get-all',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/role/createByJson',
    method: 'post',
    data
  })
}

export function getRoleWithPermissions(roleId) {
  return request({
    url: '/role/with-permissions/' + roleId,
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

// export function updateRole(id, data) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'put',
//     data
//   })
// }

export function deleteRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'delete'
  })
}

// export function deleteRole(id) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'delete'
//   })
// }

// ////////////////////////////////////
// ////////////////////////////////////
// ////////////////////////////////////
export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}
