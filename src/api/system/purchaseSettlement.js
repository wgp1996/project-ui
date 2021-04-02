import request from '@/utils/request'

// 查询结算申请单列表
export function listPurchaseSettlement(query) {
  return request({
    url: '/system/purchaseSettlement/list',
    method: 'get',
    params: query
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