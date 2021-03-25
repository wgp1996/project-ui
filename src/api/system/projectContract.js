import request from '@/utils/request'

// 查询分包合同列表
export function listProjectContract(query) {
  return request({
    url: '/system/projectContract/list',
    method: 'get',
    params: query
  })
}

// 根据单号查询分包合同明细列表
export function getProjectContractChild(djNumber) {
  return request({
    url: '/system/projectContractChild/list?djNumber='+djNumber,
    method: 'get'
  })
}


// 查询分包合同详细
export function getProjectContract(id) {
  return request({
    url: '/system/projectContract/' + id,
    method: 'get'
  })
}

// 新增分包合同
export function addProjectContract(data) {
  return request({
    url: '/system/projectContract',
    method: 'post',
    data: data
  })
}

// 修改分包合同
export function updateProjectContract(data) {
  return request({
    url: '/system/projectContract',
    method: 'put',
    data: data
  })
}

// 删除分包合同
export function delProjectContract(id) {
  return request({
    url: '/system/projectContract/' + id,
    method: 'delete'
  })
}

// 导出分包合同
export function exportProjectContract(query) {
  return request({
    url: '/system/projectContract/export',
    method: 'get',
    params: query
  })
}