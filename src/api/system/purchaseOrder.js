import request from '@/utils/request'

// 查询采购订单列表
export function listPurchaseOrder(query) {
  return request({
    url: '/system/purchaseOrder/list',
    method: 'get',
    params: query
  })
}


// 入库单查询采购订单列表
export function wareSelectList(query) {
  return request({
    url: '/system/purchaseOrder/wareSelectList',
    method: 'get',
    params: query
  })
}

// 查询采购订单审核列表
export function shListPurchaseOrder(query) {
  return request({
    url: '/system/purchaseOrder/shList',
    method: 'get',
    params: query
  })
}


// 采购订单审核
export function examinePurchaseOrder(data) {
  return request({
    url: '/system/purchaseOrder/examine',
    method: 'put',
    data: data
  })
}

// 采购订单取消审核
export function cancelAuditPurchaseOrder(id,nodeNo) {
  return request({
    url: '/system/purchaseOrder/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交采购订单
export function effectPurchaseOrder(id) {
  return request({
    url: '/system/purchaseOrder/effect/' + id,
    method: 'delete'
  })
}
// 取消提交采购订单
export function cancelPurchaseOrder(id) {
  return request({
    url: '/system/purchaseOrder/cancel/' + id,
    method: 'delete'
  })
}



// 查询采购订单详细
export function getPurchaseOrder(id) {
  return request({
    url: '/system/purchaseOrder/' + id,
    method: 'get'
  })
}

// 新增采购订单
export function addPurchaseOrder(data) {
  return request({
    url: '/system/purchaseOrder',
    method: 'post',
    data: data
  })
}

// 修改采购订单
export function updatePurchaseOrder(data) {
  return request({
    url: '/system/purchaseOrder',
    method: 'put',
    data: data
  })
}

// 审核时修改采购订单
export function updatePurchaseOrderBySh(data) {
  return request({
    url: '/system/purchaseOrder/shEdit',
    method: 'put',
    data: data
  })
}



// 删除采购订单
export function delPurchaseOrder(id) {
  return request({
    url: '/system/purchaseOrder/' + id,
    method: 'delete'
  })
}

// 导出采购订单
export function exportPurchaseOrder(query) {
  return request({
    url: '/system/purchaseOrder/export',
    method: 'get',
    params: query
  })
}