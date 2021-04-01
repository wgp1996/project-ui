import request from '@/utils/request'

// 查询采购入库列表
export function listPurchaseWare(query) {
  return request({
    url: '/system/purchaseWare/list',
    method: 'get',
    params: query
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