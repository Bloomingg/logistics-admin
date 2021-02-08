import request from '@/utils/request'

export function getOrder(params) {
  return request({
    url: '/order/getOrder',
    method: 'get',
    params
  })
}

export function deleteOrder(_id) {
  return request({
    url: '/order/deleteOrder',
    method: 'get',
    params: {
      '_id': _id
    }
  })
}

export function addOrder(data) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/updateOrder',
    method: 'post',
    data
  })
}
