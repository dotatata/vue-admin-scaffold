import request from '@/utils/request'

export function fetchPermissionList(query) {
  return request({
    url: '/permissions',
    method: 'get',
    params: query
  })
}

export function fetchPermissions(query) {
  return request({
    url: '/permission/get-all',
    method: 'get',
    params: query
  })
}

export function createPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function getPermission(permissionId) {
  return request({
    url: '/permission/' + permissionId,
    method: 'get'
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission',
    method: 'put',
    data
  })
}

export function deletePermission(permissionId) {
  return request({
    url: '/permission/' + permissionId,
    method: 'delete'
  })
}
