import request from '@/utils/request'

// 查询项目部信息列表
export function listEnginnerApplyChild(query) {
  return request({
    url: '/system/enginnerApplyChild/list',
    method: 'get',
    params: query
  })
}

export function listEnginnerByEnginner(enginnerCode) {
  return request({
    url: '/system/enginnerApplyChild/allList?'+enginnerCode,
    method: 'get',
  })
}

// 查询项目部信息详细
export function getEnginnerApplyChild(id) {
  return request({
    url: '/system/enginnerApplyChild/' + id,
    method: 'get'
  })
}

// 新增项目部信息
export function addEnginnerApplyChild(data) {
  return request({
    url: '/system/enginnerApplyChild',
    method: 'post',
    data: data
  })
}

// 修改项目部信息
export function updateEnginnerApplyChild(data) {
  return request({
    url: '/system/enginnerApplyChild',
    method: 'put',
    data: data
  })
}

// 删除项目部信息
export function delEnginnerApplyChild(id) {
  return request({
    url: '/system/enginnerApplyChild/' + id,
    method: 'delete'
  })
}

// 导出项目部信息
export function exportEnginnerApplyChild(query) {
  return request({
    url: '/system/enginnerApplyChild/export',
    method: 'get',
    params: query
  })
}