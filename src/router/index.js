import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  },
  {
    // path: '/extra',
    // component: Layout,
    // redirect: '/dashboard',
    // children: [{
    path: '/search',
    name: 'Search',
    component: () => import('@/views/extra/search'),
    // meta: {
    //   title: '物流查询',
    //   icon: 'search'
    // }
    // }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/transport',
    component: Layout,
    // redirect: '/transport/route',
    // name: '运输管理',
    meta: {
      title: '运输管理',
      icon: 'el-icon-s-help',
      flag: true
    },
    children: [{
        path: 'route',
        name: 'Route',
        component: () => import('@/views/transport/route'),
        meta: {
          title: '运输线路',
          icon: 'table'
        }
      },
      {
        path: 'frequency',
        name: 'Frequency',
        component: () => import('@/views/transport/frequency'),
        meta: {
          title: '物流班次',
          icon: 'tree'
        }
      },
      {
        path: 'logistics_track',
        name: 'LogisticsTrack',
        component: () => import('@/views/transport/logistics_track'),
        meta: {
          title: '物流跟踪',
          icon: 'tree'
        }
      }
    ]
  },
  // {
  //   path: '/finance',
  //   component: Layout,
  //   children: [{
  //     path: 'finance_manger',
  //     name: 'FinanceManger',
  //     component: () => import('@/views/finance/finance_manger'),
  //     meta: {
  //       title: '财务管理',
  //       icon: 'form'
  //     }
  //   }]
  // },
  {
    path: '/order',
    component: Layout,
    // meta: {
    //   title: '订单中心',
    //   flag:true
    // },
    children: [{
      path: 'order_manger',
      name: 'OrderManger',
      component: () => import('@/views/order/order_manger'),
      meta: {
        title: '订单管理',
        icon: 'form'
      }
    }]
  },
  {
    path: '/prims',
    component: Layout,
    meta: {
      title: '授权管理',
      icon: 'el-icon-s-help',
      flag: true
    },
    children: [{
        path: 'role',
        name: 'Role',
        component: () => import('@/views/prims/role'),
        meta: {
          title: '角色管理',
          icon: 'table'
        }
      },
      {
        path: 'access',
        name: 'Access',
        component: () => import('@/views/prims/access'),
        meta: {
          title: '权限管理',
          icon: 'tree'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    // meta: {
    //   title: '用户中心',
    //   flag:true
    // },
    children: [{
      path: 'user_list',
      name: 'UserList',
      component: () => import('@/views/user/user_list'),
      meta: {
        title: '用户管理',
        icon: 'form',
        // roles: ['admin']
      }
    }]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
