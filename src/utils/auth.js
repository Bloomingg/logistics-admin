import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get('logisToken')
}

export function setToken(token) {
  return Cookies.set('logisToken', token)
}

export function removeToken() {
  return Cookies.remove('logisToken')
}
