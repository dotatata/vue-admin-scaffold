import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'user',
  meta: { title: '用户管理', icon: 'user', roles: ['super-admin', 'admin'] },
  alwaysShow: true,
  children: [
    {
      path: 'user-list',
      component: () => import('@/views/user/user'),
      name: 'userList',
      meta: { title: '用户列表', icon: 'user', affix: true }
    },
    {
      path: 'role-list',
      component: () => import('@/views/user/role'),
      name: 'roleList',
      meta: { title: '角色列表', icon: 'el-icon-user', affix: true }
    },
    {
      path: 'permission-list',
      component: () => import('@/views/user/permission'),
      name: 'permissionList',
      meta: { title: '权限列表', icon: 'el-icon-s-fold', affix: true }
    }
  ]
}
export default userRouter
