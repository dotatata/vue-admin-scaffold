import store from '@/store'
// import { watchEffect } from 'vue'

function checkPermission(el, binding, vnode) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  const permissions = store.getters && store.getters.permissions

  // this.$watchEffect(() => {
  //   el.disabled
  // })

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasRole = roles.some(role => {
        return permissionRoles.includes(role)
      })

      const hasPermission = permissions.some(permission => {
        return permissionRoles.includes(permission)
      })

      if (!hasRole && !hasPermission) {
        // el.parentNode && el.parentNode.removeChild(el)
        el.disabled = true
        el.classList.add('is-disabled')
        // vnode.context.$off('click')
        // console.log(el)
        // console.log(vnode)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  // bind(el, binding, vnode) {
  //   console.log('bind')
  //   checkPermission(el, binding)
  // },
  inserted(el, binding, vnode) {
    // console.log('inserted')
    checkPermission(el, binding, vnode)
  }
  // update(el, binding, vnode) {
  //   console.log('update')
  //   checkPermission(el, binding, vnode)
  // }
}
