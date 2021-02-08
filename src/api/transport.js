import request from '@/utils/request'

export function getAllRoute(data) {
  return request({
    url: '/transport/route/getAll',
    method: 'post',
    data
  })
}

export function addRoute(data) {
  return request({
    url: '/transport/route/addRoute',
    method: 'post',
    data
  })
}

export function updateRoute(data) {
  return request({
    url: '/transport/route/updateRoute',
    method: 'post',
    data
  })
}

export function deleteRoute(data) {
  return request({
    url: '/transport/route/deleteRoute',
    method: 'post',
    data
  })
}


export function getAllFrequency(data) {
  return request({
    url: '/transport/frequency/getAll',
    method: 'post',
    data
  })
}

export function addFrequency(data) {
  return request({
    url: '/transport/frequency/addFrequency',
    method: 'post',
    data
  })
}

export function updateFrequency(data) {
  return request({
    url: '/transport/frequency/updateFrequency',
    method: 'post',
    data
  })
}

export function deleteFrequency(data) {
  return request({
    url: '/transport/frequency/deleteFrequency',
    method: 'post',
    data
  })
}

export function getAllTrack(data) {
  return request({
    url: '/transport/track/getAll',
    method: 'post',
    data
  })
}

export function addTrack(data) {
  return request({
    url: '/transport/track/addTrack',
    method: 'post',
    data
  })
}

export function updateTrack(data) {
  return request({
    url: '/transport/track/updateTrack',
    method: 'post',
    data
  })
}

export function deleteTrack(data) {
  return request({
    url: '/transport/track/deleteTrack',
    method: 'post',
    data
  })
}
