import request from '@/utils/request'

// 查询费用项目分类列表
export function listFeeType(query) {
  return request({
    url: '/system/feeType/list',
    method: 'get',
    params: query
  })
}

// 查询费用项目分类详细
export function getFeeType(feeTypeId) {
  return request({
    url: '/system/feeType/' + feeTypeId,
    method: 'get'
  })
}

// 新增费用项目分类
export function addFeeType(data) {
  return request({
    url: '/system/feeType',
    method: 'post',
    data: data
  })
}

// 修改费用项目分类
export function updateFeeType(data) {
  return request({
    url: '/system/feeType',
    method: 'put',
    data: data
  })
}

// 删除费用项目分类
export function delFeeType(feeTypeId) {
  return request({
    url: '/system/feeType/' + feeTypeId,
    method: 'delete'
  })
}

// 导出费用项目分类
export function exportFeeType(query) {
  return request({
    url: '/system/feeType/export',
    method: 'get',
    params: query
  })
}