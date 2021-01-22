import request from '@/utils/request'

// 查询项目预算列表
export function listBudgetInfo(query) {
  return request({
    url: '/system/budgetInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目预算详细
export function getBudgetInfo(id) {
  return request({
    url: '/system/budgetInfo/' + id,
    method: 'get'
  })
}

// 新增项目预算
export function addBudgetInfo(data) {
  return request({
    url: '/system/budgetInfo',
    method: 'post',
    data: data
  })
}

// 修改项目预算
export function updateBudgetInfo(data) {
  return request({
    url: '/system/budgetInfo',
    method: 'put',
    data: data
  })
}

// 删除项目预算
export function delBudgetInfo(id) {
  return request({
    url: '/system/budgetInfo/' + id,
    method: 'delete'
  })
}

// 导出项目预算
export function exportBudgetInfo(query) {
  return request({
    url: '/system/budgetInfo/export',
    method: 'get',
    params: query
  })
}