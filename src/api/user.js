import request from '@/utils/request'

// export function login(data) {
//   return request({
//     // url: '/vue-element-admin/user/login',
//     url: '/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     // url: '/vue-element-admin/user/info',
//     url: '/auth/user-info-by-token',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     // url: '/vue-element-admin/user/logout',
//     url: '/logout',
//     method: 'post'
//   })
// }

export function fetchUserList(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/createByJson',
    method: 'post',
    data
  })
}

export function getUserWithRoles(userId) {
  return request({
    url: '/user/with-roles/' + userId,
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function deleteUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'delete'
  })
}
