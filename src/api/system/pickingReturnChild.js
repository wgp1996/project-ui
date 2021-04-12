import request from '@/utils/request'

// 查询借用归还单子表列表
export function listPickingReturnChild(djNumber) {
  return request({
    url: '/system/pickingReturnChild/list?djNumber='+djNumber,
    method: 'get',
    // params: query
  })
}

// 查询借用归还单子表详细
export function getPickingReturnChild(id) {
  return request({
    url: '/system/pickingReturnChild/' + id,
    method: 'get'
  })
}

// 新增借用归还单子表
export function addPickingReturnChild(data) {
  return request({
    url: '/system/pickingReturnChild',
    method: 'post',
    data: data
  })
}

// 修改借用归还单子表
export function updatePickingReturnChild(data) {
  return request({
    url: '/system/pickingReturnChild',
    method: 'put',
    data: data
  })
}

// 删除借用归还单子表
export function delPickingReturnChild(id) {
  return request({
    url: '/system/pickingReturnChild/' + id,
    method: 'delete'
  })
}

// 导出借用归还单子表
export function exportPickingReturnChild(query) {
  return request({
    url: '/system/pickingReturnChild/export',
    method: 'get',
    params: query
  })
}