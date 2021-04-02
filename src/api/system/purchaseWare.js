import request from '@/utils/request'

// 查询采购入库列表
export function listPurchaseWare(query) {
  return request({
    url: '/system/purchaseWare/list',
    method: 'get',
    params: query
  })
}

// 结算单查询采购入库列表
export function settlementSelectList(query) {
  return request({
    url: '/system/purchaseWare/settlementSelectList',
    method: 'get',
    params: query
  })
}



// 查询采购入库审核列表
export function shListPurchaseWare(query) {
  return request({
    url: '/system/purchaseWare/shList',
    method: 'get',
    params: query
  })
}


// 采购入库审核
export function examinePurchaseWare(data) {
  return request({
    url: '/system/purchaseWare/examine',
    method: 'put',
    data: data
  })
}

// 采购入库取消审核
export function cancelAuditPurchaseWare(id,nodeNo) {
  return request({
    url: '/system/purchaseWare/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交采购入库
export function effectPurchaseWare(id) {
  return request({
    url: '/system/purchaseWare/effect/' + id,
    method: 'delete'
  })
}
// 取消提交采购入库
export function cancelPurchaseWare(id) {
  return request({
    url: '/system/purchaseWare/cancel/' + id,
    method: 'delete'
  })
}

// 查询采购入库详细
export function getPurchaseWare(id) {
  return request({
    url: '/system/purchaseWare/' + id,
    method: 'get'
  })
}

// 新增采购入库
export function addPurchaseWare(data) {
  return request({
    url: '/system/purchaseWare',
    method: 'post',
    data: data
  })
}

// 修改采购入库
export function updatePurchaseWare(data) {
  return request({
    url: '/system/purchaseWare',
    method: 'put',
    data: data
  })
}

// 删除采购入库
export function delPurchaseWare(id) {
  return request({
    url: '/system/purchaseWare/' + id,
    method: 'delete'
  })
}

// 导出采购入库
export function exportPurchaseWare(query) {
  return request({
    url: '/system/purchaseWare/export',
    method: 'get',
    params: query
  })
}