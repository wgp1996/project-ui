import request from '@/utils/request'

// 查询费用报销单列表
export function listFeeApplyInfo(query) {
  return request({
    url: '/system/feeApplyInfo/list',
    method: 'get',
    params: query
  })
}



// 查询费用报销单审核列表
export function shListFeeApplyInfo(query) {
  return request({
    url: '/system/feeApplyInfo/shList',
    method: 'get',
    params: query
  })
}


// 费用报销单审核
export function examineFeeApplyInfo(data) {
  return request({
    url: '/system/feeApplyInfo/examine',
    method: 'put',
    data: data
  })
}

// 费用报销单取消审核
export function cancelAuditFeeApplyInfo(id,nodeNo) {
  return request({
    url: '/system/feeApplyInfo/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交费用报销单
export function effectFeeApplyInfo(id) {
  return request({
    url: '/system/feeApplyInfo/effect/' + id,
    method: 'delete'
  })
}
// 取消提交费用报销单
export function cancelFeeApplyInfo(id) {
  return request({
    url: '/system/feeApplyInfo/cancel/' + id,
    method: 'delete'
  })
}

// 查询费用报销单详细
export function getFeeApplyInfo(id) {
  return request({
    url: '/system/feeApplyInfo/' + id,
    method: 'get'
  })
}

// 新增费用报销单
export function addFeeApplyInfo(data) {
  return request({
    url: '/system/feeApplyInfo',
    method: 'post',
    data: data
  })
}

// 修改费用报销单
export function updateFeeApplyInfo(data) {
  return request({
    url: '/system/feeApplyInfo',
    method: 'put',
    data: data
  })
}

// 删除费用报销单
export function delFeeApplyInfo(id) {
  return request({
    url: '/system/feeApplyInfo/' + id,
    method: 'delete'
  })
}

// 导出费用报销单
export function exportFeeApplyInfo(query) {
  return request({
    url: '/system/feeApplyInfo/export',
    method: 'get',
    params: query
  })
}