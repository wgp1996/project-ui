import request from '@/utils/request'

// 查询结算申请单列表
export function listPurchaseSettlement(query) {
  return request({
    url: '/system/purchaseSettlement/list',
    method: 'get',
    params: query
  })
}



// 查询采购结算审核列表
export function shListPurchaseSettlement(query) {
  return request({
    url: '/system/purchaseSettlement/shList',
    method: 'get',
    params: query
  })
}


// 采购结算审核
export function examinePurchaseSettlement(data) {
  return request({
    url: '/system/purchaseSettlement/examine',
    method: 'put',
    data: data
  })
}

// 采购结算取消审核
export function cancelAuditPurchaseSettlement(id,nodeNo) {
  return request({
    url: '/system/purchaseSettlement/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交采购结算
export function effectPurchaseSettlement(id) {
  return request({
    url: '/system/purchaseSettlement/effect/' + id,
    method: 'delete'
  })
}
// 取消提交采购结算
export function cancelPurchaseSettlement(id) {
  return request({
    url: '/system/purchaseSettlement/cancel/' + id,
    method: 'delete'
  })
}


// 查询结算申请单详细
export function getPurchaseSettlement(id) {
  return request({
    url: '/system/purchaseSettlement/' + id,
    method: 'get'
  })
}

// 新增结算申请单
export function addPurchaseSettlement(data) {
  return request({
    url: '/system/purchaseSettlement',
    method: 'post',
    data: data
  })
}

// 修改结算申请单
export function updatePurchaseSettlement(data) {
  return request({
    url: '/system/purchaseSettlement',
    method: 'put',
    data: data
  })
}

// 审核时修改结算申请单
export function updatePurchaseSettlementBySh(data) {
  return request({
    url: '/system/purchaseSettlement/shEdit',
    method: 'put',
    data: data
  })
}



// 删除结算申请单
export function delPurchaseSettlement(id) {
  return request({
    url: '/system/purchaseSettlement/' + id,
    method: 'delete'
  })
}

// 导出结算申请单
export function exportPurchaseSettlement(query) {
  return request({
    url: '/system/purchaseSettlement/export',
    method: 'get',
    params: query
  })
}