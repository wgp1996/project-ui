import request from '@/utils/request'

// 查询分包合同明细列表
export function listProjectContractChild(query) {
  return request({
    url: '/system/projectContractChild/list',
    method: 'get',
    params: query
  })
}

// 查询分包合同明细详细
export function getProjectContractChild(id) {
  return request({
    url: '/system/projectContractChild/' + id,
    method: 'get'
  })
}


// 查询分包合同明细详细
export function getProjectContractChildByNum(djNumber) {
  return request({
    url: '/system/projectContractChild/list?djNumber=' + djNumber,
    method: 'get'
  })
}

// 新增分包合同明细
export function addProjectContractChild(data) {
  return request({
    url: '/system/projectContractChild',
    method: 'post',
    data: data
  })
}

// 修改分包合同明细
export function updateProjectContractChild(data) {
  return request({
    url: '/system/projectContractChild',
    method: 'put',
    data: data
  })
}

// 删除分包合同明细
export function delProjectContractChild(id) {
  return request({
    url: '/system/projectContractChild/' + id,
    method: 'delete'
  })
}

// 导出分包合同明细
export function exportProjectContractChild(query) {
  return request({
    url: '/system/projectContractChild/export',
    method: 'get',
    params: query
  })
}