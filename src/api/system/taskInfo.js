import request from '@/utils/request'

// 查询我安排的任务管理列表
export function listTaskInfo(query) {
  return request({
    url: '/system/taskInfo/list',
    method: 'get',
    params: query
  })
}

// 查询派给我的任务管理列表
export function sendListTaskInfo(query) {
  return request({
    url: '/system/taskInfo/sendList',
    method: 'get',
    params: query
  })
}

export function sendAllList(query) {
  return request({
    url: '/system/taskInfo/sendAllList',
    method: 'get',
    params: query
  })
}

//查询首页待审核菜单列表
export function selectShMenuList() {
  return request({
    url: '/system/taskInfo/selectShMenuList',
    method: 'get',
  })
}

// 查询我安排的任务管理详细
export function getTaskInfo(id) {
  return request({
    url: '/system/taskInfo/' + id,
    method: 'get'
  })
}
// 查询派给我的任务管理详细
export function getSendTaskInfo(id) {
  return request({
    url: '/system/taskInfo/detail/' + id,
    method: 'get'
  })
}

// 新增任务管理
export function addTaskInfo(data) {
  return request({
    url: '/system/taskInfo',
    method: 'post',
    data: data
  })
}

// 修改任务优先级 0 普通 1重要 2紧急
export function changeUrgentStatus(id,status,taskCode) {
  return request({
    url: '/system/taskInfo/changeUrgentStatus/' + id+"/"+status+"/"+taskCode,
    method: 'get'
  })
}


// 任务验收
export function checkAccept(id,message,num,type) {
  return request({
    url: '/system/taskInfo/checkAccept/' + id+"/"+message+"/"+num,
    method: 'get'
  })
}

// 催办任务
export function changeIsUrge(id) {
  return request({
    url: '/system/taskInfo/changeIsUrge/' + id,
    method: 'get'
  })
}

// 反馈任务进度
export function changeTaskNum(id,taskNum) {
  return request({
    url: '/system/taskInfo/changeTaskNum/' + id+"/"+taskNum,
    method: 'get'
  })
}



// 修改任务管理
export function updateTaskInfo(data) {
  return request({
    url: '/system/taskInfo',
    method: 'put',
    data: data
  })
}

// 删除任务管理
export function delTaskInfo(id) {
  return request({
    url: '/system/taskInfo/' + id,
    method: 'delete'
  })
}

// 导出任务管理
export function exportTaskInfo(query) {
  return request({
    url: '/system/taskInfo/export',
    method: 'get',
    params: query
  })
}