import request from '@/utils/request'

// 查询领料出库单子表列表
export function listPickingDeliveryChild(djNumber) {
  return request({
    url: '/system/pickingDeliveryChild/list?djNumber='+djNumber,
    method: 'get',
    // params: query
  })
}

// 查询领料出库单子表详细
export function getPickingDeliveryChild(id) {
  return request({
    url: '/system/pickingDeliveryChild/' + id,
    method: 'get'
  })
}

// 新增领料出库单子表
export function addPickingDeliveryChild(data) {
  return request({
    url: '/system/pickingDeliveryChild',
    method: 'post',
    data: data
  })
}

// 修改领料出库单子表
export function updatePickingDeliveryChild(data) {
  return request({
    url: '/system/pickingDeliveryChild',
    method: 'put',
    data: data
  })
}

// 删除领料出库单子表
export function delPickingDeliveryChild(id) {
  return request({
    url: '/system/pickingDeliveryChild/' + id,
    method: 'delete'
  })
}

// 导出领料出库单子表
export function exportPickingDeliveryChild(query) {
  return request({
    url: '/system/pickingDeliveryChild/export',
    method: 'get',
    params: query
  })
}