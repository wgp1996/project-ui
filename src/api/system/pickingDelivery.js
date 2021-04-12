import request from '@/utils/request'

// 查询领料出库单列表
export function listPickingDelivery(query) {
  return request({
    url: '/system/pickingDelivery/list',
    method: 'get',
    params: query
  })
}

// 借还单查询出库列表
export function returnSelectList(query) {
  return request({
    url: '/system/pickingDelivery/returnSelectList',
    method: 'get',
    params: query
  })
}

 

// 查询采购入库审核列表
export function shListPickingDelivery(query) {
  return request({
    url: '/system/pickingDelivery/shList',
    method: 'get',
    params: query
  })
}


// 采购入库审核
export function examinePickingDelivery(data) {
  return request({
    url: '/system/pickingDelivery/examine',
    method: 'put',
    data: data
  })
}

// 采购入库取消审核
export function cancelAuditPickingDelivery(id,nodeNo) {
  return request({
    url: '/system/pickingDelivery/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交采购入库
export function effectPickingDelivery(id) {
  return request({
    url: '/system/pickingDelivery/effect/' + id,
    method: 'delete'
  })
}
// 取消提交采购入库
export function cancelPickingDelivery(id) {
  return request({
    url: '/system/pickingDelivery/cancel/' + id,
    method: 'delete'
  })
}

// 查询领料出库单详细
export function getPickingDelivery(id) {
  return request({
    url: '/system/pickingDelivery/' + id,
    method: 'get'
  })
}

// 新增领料出库单
export function addPickingDelivery(data) {
  return request({
    url: '/system/pickingDelivery',
    method: 'post',
    data: data
  })
}

// 修改领料出库单
export function updatePickingDelivery(data) {
  return request({
    url: '/system/pickingDelivery',
    method: 'put',
    data: data
  })
}

// 删除领料出库单
export function delPickingDelivery(id) {
  return request({
    url: '/system/pickingDelivery/' + id,
    method: 'delete'
  })
}

// 导出领料出库单
export function exportPickingDelivery(query) {
  return request({
    url: '/system/pickingDelivery/export',
    method: 'get',
    params: query
  })
}