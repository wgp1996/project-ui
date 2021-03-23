import request from '@/utils/request'

// 查询编制清单列表
export function listProjectInventory(query) {
  return request({
    url: '/system/projectInventory/list',
    method: 'get',
    params: query
  })
}

// 查询编制清单详细
export function getProjectInventory(id) {
  return request({
    url: '/system/projectInventory/' + id,
    method: 'get'
  })
}

// 新增编制清单
export function addProjectInventory(data) {
  return request({
    url: '/system/projectInventory',
    method: 'post',
    data: data
  })
}

// 修改编制清单
export function updateProjectInventory(data) {
  return request({
    url: '/system/projectInventory',
    method: 'put',
    data: data
  })
}

// 删除编制清单
export function delProjectInventory(id) {
  return request({
    url: '/system/projectInventory/' + id,
    method: 'delete'
  })
}

// 导出编制清单
export function exportProjectInventory(query) {
  return request({
    url: '/system/projectInventory/export',
    method: 'get',
    params: query
  })
}