import request from '@/utils/request'

// 查询领料出库单列表
export function listPickingDelivery(query) {
  return request({
    url: '/system/pickingDelivery/list',
    method: 'get',
    params: query
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