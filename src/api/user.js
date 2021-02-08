import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: 'user/userList',
    method: 'get',
    params
  })
}
export function updateStatus(data) {
  return request({
    url: 'user/updateStatus',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: 'user/addUser',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: 'user/deleteUser',
    method: 'get',
    params: {
      '_id': id
    }
  })
}

export function addRole(data) {
  return request({
    url: 'user/addRole',
    method: 'post',
    data
  })
}

export function getRoles(params) {
  return request({
    url: 'user/getRoles',
    method: 'get',
    params
  })
}

export function deleteRole(id) {
  return request({
    url: 'user/deleteRole',
    method: 'get',
    params: {
      '_id': id
    }
  })
}

export function addAccess(data) {
  return request({
    url: 'user/addAccess',
    method: 'post',
    data
  })
}

export function getAccess(params) {
  return request({
    url: 'user/getAccess',
    method: 'get',
    params
  })
}

export function deleteAccess(id) {
  return request({
    url: 'user/deleteAccess',
    method: 'get',
    params: {
      '_id': id
    }
  })
}

export function addRoleAccess(data) {
  return request({
    url: 'user/addRoleAccess',
    method: 'post',
    data
  })
}

export function editRoleAccess(data) {
  return request({
    url: 'user/updateRoleAccess',
    method: 'post',
    data
  })
}

export function getRoleAccess(id) {
  return request({
    url: 'user/getRoleAccess',
    method: 'get',
    params: {
      'role_id': id
    }
  })
}
