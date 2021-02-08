import request from '@/utils/request'

export function getVericode() {
  return request({
    url: '/login/getVericode',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/login/getInfo',
    method: 'get'
  })
}

export function doLogin(data) {
  return request({
    url: '/login/doLogin',
    method: 'post',
    data
  })
}
