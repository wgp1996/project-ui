import request from '@/utils/request'

// 查询费用报销子表列表
export function listFeeApplyInfoChild(djNumber) {
  return request({
    url: '/system/feeApplyInfoChild/list?djNumber='+djNumber,
    method: 'get'
  })
}

// 查询费用报销子表详细
export function getFeeApplyInfoChild(id) {
  return request({
    url: '/system/feeApplyInfoChild/' + id,
    method: 'get'
  })
}

// 新增费用报销子表
export function addFeeApplyInfoChild(data) {
  return request({
    url: '/system/feeApplyInfoChild',
    method: 'post',
    data: data
  })
}

// 修改费用报销子表
export function updateFeeApplyInfoChild(data) {
  return request({
    url: '/system/feeApplyInfoChild',
    method: 'put',
    data: data
  })
}

// 删除费用报销子表
export function delFeeApplyInfoChild(id) {
  return request({
    url: '/system/feeApplyInfoChild/' + id,
    method: 'delete'
  })
}

// 导出费用报销子表
export function exportFeeApplyInfoChild(query) {
  return request({
    url: '/system/feeApplyInfoChild/export',
    method: 'get',
    params: query
  })
}