import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissions = store.getters && store.getters.permissions
    const permissionRoles = value

    const hasRole = roles.some(role => {
      return permissionRoles.includes(role)
    })

    const hasPermission = permissions.some(permission => {
      return permissionRoles.includes(permission)
    })
    return hasRole || hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
