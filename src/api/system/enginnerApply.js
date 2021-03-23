import request from '@/utils/request'

// 查询立项申请列表
export function listEnginnerApply(query) {
  return request({
    url: '/system/enginnerApply/list',
    method: 'get',
    params: query
  })
}

// 查询立项申请详细
export function getEnginnerApply(id) {
  return request({
    url: '/system/enginnerApply/' + id,
    method: 'get'
  })
}

// 新增立项申请
export function addEnginnerApply(data) {
  return request({
    url: '/system/enginnerApply',
    method: 'post',
    data: data
  })
}

// 修改立项申请
export function updateEnginnerApply(data) {
  return request({
    url: '/system/enginnerApply',
    method: 'put',
    data: data
  })
}

// 删除立项申请
export function delEnginnerApply(id) {
  return request({
    url: '/system/enginnerApply/' + id,
    method: 'delete'
  })
}

// 导出立项申请
export function exportEnginnerApply(query) {
  return request({
    url: '/system/enginnerApply/export',
    method: 'get',
    params: query
  })
}