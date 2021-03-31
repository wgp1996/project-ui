import request from '@/utils/request'

// 查询采购订单子表列表
export function listPurchaseOrderChild(djNumber) {
  return request({
    url: '/system/purchaseOrderChild/list?djNumber='+djNumber,
    method: 'get',
  })
}

// 查询采购订单子表详细
export function getPurchaseOrderChild(id) {
  return request({
    url: '/system/purchaseOrderChild/' + id,
    method: 'get'
  })
}

// 新增采购订单子表
export function addPurchaseOrderChild(data) {
  return request({
    url: '/system/purchaseOrderChild',
    method: 'post',
    data: data
  })
}

// 修改采购订单子表
export function updatePurchaseOrderChild(data) {
  return request({
    url: '/system/purchaseOrderChild',
    method: 'put',
    data: data
  })
}

// 删除采购订单子表
export function delPurchaseOrderChild(id) {
  return request({
    url: '/system/purchaseOrderChild/' + id,
    method: 'delete'
  })
}

// 导出采购订单子表
export function exportPurchaseOrderChild(query) {
  return request({
    url: '/system/purchaseOrderChild/export',
    method: 'get',
    params: query
  })
}