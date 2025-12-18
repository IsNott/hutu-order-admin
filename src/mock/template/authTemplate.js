export const authTemplate = {
  login: {
    code: 200,
    message: '成功',
    data: {
      userId: '1',
      username: 'admin',
      nickname: '管理员',
      avatarUrl: '/static/20251210160851.jpg',
      roles: ['admin'],
      token: '1234567890'
    }
  },
  getMenu: {
    code: 200,
    message: '成功',
    data: [
      {
        name: '首页',
        icon: 'el-icon-s-home',
        path: '/',
        index: 1,
        type: 'menu'
      },
      {
        name: '门店管理',
        icon: 'el-icon-s-goods',
        path: '/store',
        type: 'menu',
        index: 2
      },
      {
        name: '分类管理',
        icon: 'el-icon-s-goods',
        path: '/catalog',
        type: 'menu',
        index: 3
      },
      {
        name: '商品管理',
        icon: 'el-icon-s-goods',
        path: '/goods',
        type: 'menu',
        index: 4
      },
      {
        name: '订单管理',
        icon: 'el-icon-s-order',
        path: '/orders',
        type: 'menu',
        index: 5
      },
      {
        name: 'SKU管理',
        icon: 'el-icon-s-custom',
        path: '/sku',
        type: 'menu',
        index: 6
      },
      {
        name: '轮播图管理',
        icon: 'el-icon-picture-outline',
        path: '/playImage',
        type: 'menu',
        index: 7
      },
      {
        name: '系统管理',
        icon: 'el-icon-s-tools',
        index: 8,
        type: 'folder',
        children: [
          {
            name: '菜单管理',
            icon: 'el-icon-menu',
            path: '/menu',
            type: 'menu',
            index: 0
          },
          {
            name: '用户管理',
            icon: 'el-icon-user',
            path: '/user',
            type: 'menu',
            index: 1
          },
          {
            name: '角色管理',
            icon: 'el-icon-s-custom',
            path: '/role',
            type: 'menu',
            index: 2
          },
          {
            name: '权限管理',
            icon: 'el-icon-s-permission',
            path: '/permission',
            type: 'menu',
            index: 3
          },
          {
            name: '字典管理',
            icon: 'el-icon-s-tools',
            path: '/dict',
            type: 'menu',
            index: 4
          }
        ]
      },
    ]
  },
  getUserInfo: {
    code: 200,
    message: '成功',
    data: {
      userId: '1',
      username: 'admin',
      nickname: '管理员',
      avatarUrl: '/static/20251210160851.jpg',
      roles: ['admin']
    }

  }
}