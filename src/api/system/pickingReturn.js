import request from '@/utils/request'

// 查询借用归还单列表
export function listPickingReturn(query) {
  return request({
    url: '/system/pickingReturn/list',
    method: 'get',
    params: query
  })
}

// 查询借用归还单详细
export function getPickingReturn(id) {
  return request({
    url: '/system/pickingReturn/' + id,
    method: 'get'
  })
}




// 查询借用归还审核列表
export function shListPickingReturn(query) {
  return request({
    url: '/system/pickingReturn/shList',
    method: 'get',
    params: query
  })
}


// 借用归还审核
export function examinePickingReturn(data) {
  return request({
    url: '/system/pickingReturn/examine',
    method: 'put',
    data: data
  })
}
 
// 借用归还取消审核
export function cancelAuditPickingReturn(id,nodeNo) {
  return request({
    url: '/system/pickingReturn/cancelAudit/' + id+"/"+nodeNo,
    method: 'delete'
  })
}

// 提交借用归还
export function effectPickingReturn(id) {
  return request({
    url: '/system/pickingReturn/effect/' + id,
    method: 'delete'
  })
}
// 取消提交借用归还
export function cancelPickingReturn(id) {
  return request({
    url: '/system/pickingReturn/cancel/' + id,
    method: 'delete'
  })
}

// 新增借用归还单
export function addPickingReturn(data) {
  return request({
    url: '/system/pickingReturn',
    method: 'post',
    data: data
  })
}

// 修改借用归还单
export function updatePickingReturn(data) {
  return request({
    url: '/system/pickingReturn',
    method: 'put',
    data: data
  })
}

// 删除借用归还单
export function delPickingReturn(id) {
  return request({
    url: '/system/pickingReturn/' + id,
    method: 'delete'
  })
}

// 导出借用归还单
export function exportPickingReturn(query) {
  return request({
    url: '/system/pickingReturn/export',
    method: 'get',
    params: query
  })
}