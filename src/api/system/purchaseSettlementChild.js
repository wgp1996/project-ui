import request from '@/utils/request'

// 查询结算申请单明细列表
export function listPurchaseSettlementChild(djNumber) {
  return request({
    url: '/system/purchaseSettlementChild/list?djNumber='+djNumber,
    method: 'get',
  })
}

// 查询结算申请单明细详细
export function getPurchaseSettlementChild(id) {
  return request({
    url: '/system/purchaseSettlementChild/' + id,
    method: 'get'
  })
}

// 新增结算申请单明细
export function addPurchaseSettlementChild(data) {
  return request({
    url: '/system/purchaseSettlementChild',
    method: 'post',
    data: data
  })
}

// 修改结算申请单明细
export function updatePurchaseSettlementChild(data) {
  return request({
    url: '/system/purchaseSettlementChild',
    method: 'put',
    data: data
  })
}

// 删除结算申请单明细
export function delPurchaseSettlementChild(id) {
  return request({
    url: '/system/purchaseSettlementChild/' + id,
    method: 'delete'
  })
}

// 导出结算申请单明细
export function exportPurchaseSettlementChild(query) {
  return request({
    url: '/system/purchaseSettlementChild/export',
    method: 'get',
    params: query
  })
}