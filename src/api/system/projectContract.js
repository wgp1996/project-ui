import request from '@/utils/request'

// 查询分包合同列表
export function listProjectContract(query) {
  return request({
    url: '/system/projectContract/list',
    method: 'get',
    params: query
  })
}


// 查询分包合同审核列表
export function shListProjectContract(query) {
  return request({
    url: '/system/projectContract/shList',
    method: 'get',
    params: query
  })
}


// 分包合同审核
export function examineProjectContract(data) {
  return request({
    url: '/system/projectContract/examine',
    method: 'put',
    data: data
  })
}

// 分包合同取消审核
export function cancelAuditProjectContract(id,nodeNo) {
  return request({
    url: '/system/projectContract/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交分包合同
export function effectProjectContract(id) {
  return request({
    url: '/system/projectContract/effect/' + id,
    method: 'delete'
  })
}
// 取消提交分包合同
export function cancelProjectContract(id) {
  return request({
    url: '/system/projectContract/cancel/' + id,
    method: 'delete'
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