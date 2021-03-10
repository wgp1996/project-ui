import request from '@/utils/request'

// 查询任务对话详情列表
export function listTaskMessage(query) {
  return request({
    url: '/system/taskMessage/list',
    method: 'get',
    params: query
  })
}

// 查询任务对话详情详细
export function getTaskMessage(id) {
  return request({
    url: '/system/taskMessage/' + id,
    method: 'get'
  })
}

// 新增任务对话详情
export function addTaskMessage(data) {
  return request({
    url: '/system/taskMessage',
    method: 'post',
    data: data
  })
}

// 修改任务对话详情
export function updateTaskMessage(data) {
  return request({
    url: '/system/taskMessage',
    method: 'put',
    data: data
  })
}

// 删除任务对话详情
export function delTaskMessage(id) {
  return request({
    url: '/system/taskMessage/' + id,
    method: 'delete'
  })
}

// 导出任务对话详情
export function exportTaskMessage(query) {
  return request({
    url: '/system/taskMessage/export',
    method: 'get',
    params: query
  })
}