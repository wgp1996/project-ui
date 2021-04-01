import request from '@/utils/request'

// 查询采购入库子表列表
export function listPurchaseWareChild(djNumber) {
  return request({
    url: '/system/purchaseWareChild/list?djNumber='+djNumber,
    method: 'get'
  })
}

// 查询采购入库子表详细
export function getPurchaseWareChild(id) {
  return request({
    url: '/system/purchaseWareChild/' + id,
    method: 'get'
  })
}

// 新增采购入库子表
export function addPurchaseWareChild(data) {
  return request({
    url: '/system/purchaseWareChild',
    method: 'post',
    data: data
  })
}

// 修改采购入库子表
export function updatePurchaseWareChild(data) {
  return request({
    url: '/system/purchaseWareChild',
    method: 'put',
    data: data
  })
}

// 删除采购入库子表
export function delPurchaseWareChild(id) {
  return request({
    url: '/system/purchaseWareChild/' + id,
    method: 'delete'
  })
}

// 导出采购入库子表
export function exportPurchaseWareChild(query) {
  return request({
    url: '/system/purchaseWareChild/export',
    method: 'get',
    params: query
  })
}