import request from '@/utils/request'

// 查询费用项目列表
export function listFeeInfo(query) {
  return request({
    url: '/system/feeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询费用项目详细
export function getFeeInfo(id) {
  return request({
    url: '/system/feeInfo/' + id,
    method: 'get'
  })
}

// 新增费用项目
export function addFeeInfo(data) {
  return request({
    url: '/system/feeInfo',
    method: 'post',
    data: data
  })
}

// 修改费用项目
export function updateFeeInfo(data) {
  return request({
    url: '/system/feeInfo',
    method: 'put',
    data: data
  })
}

// 删除费用项目
export function delFeeInfo(id) {
  return request({
    url: '/system/feeInfo/' + id,
    method: 'delete'
  })
}

// 导出费用项目
export function exportFeeInfo(query) {
  return request({
    url: '/system/feeInfo/export',
    method: 'get',
    params: query
  })
}