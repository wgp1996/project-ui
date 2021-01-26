import request from '@/utils/request'

// 查询总包合同列表
export function listContractGenera(query) {
  return request({
    url: '/system/contractGenera/list',
    method: 'get',
    params: query
  })
}

// 查询总包合同详细
export function getContractGenera(id) {
  return request({
    url: '/system/contractGenera/' + id,
    method: 'get'
  })
}

// 新增总包合同
export function addContractGenera(data) {
  return request({
    url: '/system/contractGenera',
    method: 'post',
    data: data
  })
}

// 修改总包合同
export function updateContractGenera(data) {
  return request({
    url: '/system/contractGenera',
    method: 'put',
    data: data
  })
}

// 删除总包合同
export function delContractGenera(id) {
  return request({
    url: '/system/contractGenera/' + id,
    method: 'delete'
  })
}

// 导出总包合同
export function exportContractGenera(query) {
  return request({
    url: '/system/contractGenera/export',
    method: 'get',
    params: query
  })
}