import request from '@/utils/request'

// 查询编制清单列表
export function listProjectInvent(query) {
  return request({
    url: '/system/projectInvent/list',
    method: 'get',
    params: query
  })
}
// 项目编码查询编制清单列表
export function listProjectInvents(projectCode) {
  return request({
    url: '/system/projectInvent/list?projectCode='+projectCode,
    method: 'get'
  })
}

// 查询编制清单详细
export function getProjectInvent(id) {
  return request({
    url: '/system/projectInvent/' + id,
    method: 'get'
  })
}

// 新增编制清单
export function addProjectInvent(data) {
  return request({
    url: '/system/projectInvent',
    method: 'post',
    data: data
  })
}

// 修改编制清单
export function updateProjectInvent(data) {
  return request({
    url: '/system/projectInvent',
    method: 'put',
    data: data
  })
}

// 删除编制清单
export function delProjectInvent(id) {
  return request({
    url: '/system/projectInvent/' + id,
    method: 'delete'
  })
}

// 导出编制清单
export function exportProjectInvent(query) {
  return request({
    url: '/system/projectInvent/export',
    method: 'get',
    params: query
  })
}