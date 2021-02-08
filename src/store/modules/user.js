import {
  doLogin,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    role: '',
    avatar: '',
    accesses: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ACCESSES: (state, accesses) => {
    state.accesses = accesses
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      vericode
    } = userInfo
    return new Promise((resolve, reject) => {
      doLogin({
        username: username.trim(),
        password: password,
        vericode: vericode
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data
        console.log(data);
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {
          accesses,
          avatar,
          role
        } = data

        // roles must be a non-empty array
        if (!accesses || accesses.length <= 0 && role != '超级管理员') {
          reject('getInfo: accesses must be a non-null array!')
        }

        commit('SET_ACCESSES', accesses)
        commit('SET_ROLE', role)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
