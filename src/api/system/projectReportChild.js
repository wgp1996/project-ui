import request from '@/utils/request'

// 查询产值明细列表
export function listProjectReportChild(query) {
  return request({
    url: '/system/projectReportChild/list',
    method: 'get',
    params: query
  })
}

// 查询产值明细列表
export function getProjectReportChildList(djNumber) {
  return request({
    url: '/system/projectReportChild/list?djNumber='+djNumber,
    method: 'get'
  })
}

// 查询产值明细详细
export function getProjectReportChild(id) {
  return request({
    url: '/system/projectReportChild/' + id,
    method: 'get'
  })
}

// 新增产值明细
export function addProjectReportChild(data) {
  return request({
    url: '/system/projectReportChild',
    method: 'post',
    data: data
  })
}

// 修改产值明细
export function updateProjectReportChild(data) {
  return request({
    url: '/system/projectReportChild',
    method: 'put',
    data: data
  })
}

// 删除产值明细
export function delProjectReportChild(id) {
  return request({
    url: '/system/projectReportChild/' + id,
    method: 'delete'
  })
}

// 导出产值明细
export function exportProjectReportChild(query) {
  return request({
    url: '/system/projectReportChild/export',
    method: 'get',
    params: query
  })
}