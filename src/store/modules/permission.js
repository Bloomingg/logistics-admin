import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(accesses, route) {
  if (route.meta && route.meta.flag == undefined) {
    return accesses.some(access => route.meta.title == access.module_name)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param accesses
 */
export function filterAsyncRoutes(routes, accesses) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    // console.log(tmp);
    if (hasPermission(accesses, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, accesses)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // console.log(state.routes);
  }
}

const actions = {
  generateRoutes({
    commit
  }, info) {
    return new Promise(resolve => {
      let accessedRoutes
      const {
        accesses,
        role
      } = info
      if (role == "超级管理员") {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, accesses)
      }
      console.log(accessedRoutes);
      accessedRoutes.forEach(item => {
        if (item.children && item.children.length == 0 && item.meta) item.hidden = true
      })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
