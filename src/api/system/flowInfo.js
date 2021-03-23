import request from '@/utils/request'

// 查询流程表列表
export function listFlowInfo(query) {
  return request({
    url: '/system/flowInfo/list',
    method: 'get',
    params: query
  })
}

// 查询单据流程环节列表
export function djFlowList(djId,flowStatus) {
  return request({
    url: '/system/flowInfo/flowList?djId='+djId+'&flowStatus='+flowStatus,
    method: 'get'
  })
}


//查询审批节点
export function listNode(flow_no) {
  return request({
    url: '/system/flowNode/list?flowNo='+flow_no,
    method: 'get',
  })
}
// 删除审批节点
export function delFlowNode(id) {
  return request({
    url: '/system/flowNode/' + id,
    method: 'delete'
  })
}


// 查询流程表详细
export function getFlowInfo(id) {
  return request({
    url: '/system/flowInfo/' + id,
    method: 'get'
  })
}

// 新增流程表
export function addFlowInfo(data) {
  return request({
    url: '/system/flowInfo',
    method: 'post',
    data: data
  })
}

// 修改流程表
export function updateFlowInfo(data) {
  return request({
    url: '/system/flowInfo',
    method: 'put',
    data: data
  })
}

// 删除流程表
export function delFlowInfo(id) {
  return request({
    url: '/system/flowInfo/' + id,
    method: 'delete'
  })
}

// 启用流程表
export function effectFlowInfo(id) {
  return request({
    url: '/system/flowInfo/effect/' + id,
    method: 'delete'
  })
}

// 停用流程表
export function cancelFlowInfo(id) {
  return request({
    url: '/system/flowInfo/cancel/' + id,
    method: 'delete'
  })
}



// 导出流程表
export function exportFlowInfo(query) {
  return request({
    url: '/system/flowInfo/export',
    method: 'get',
    params: query
  })
}