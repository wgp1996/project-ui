import request from '@/utils/request'

// 查询产值提报列表
export function listProjectReport(query) {
  return request({
    url: '/system/projectReport/list',
    method: 'get',
    params: query
  })
}

// 查询产值提报详细
export function getProjectReport(id) {
  return request({
    url: '/system/projectReport/' + id,
    method: 'get'
  })
}

// 新增产值提报
export function addProjectReport(data) {
  return request({
    url: '/system/projectReport',
    method: 'post',
    data: data
  })
}

// 修改产值提报
export function updateProjectReport(data) {
  return request({
    url: '/system/projectReport',
    method: 'put',
    data: data
  })
}

// 删除产值提报
export function delProjectReport(id) {
  return request({
    url: '/system/projectReport/' + id,
    method: 'delete'
  })
}

// 导出产值提报
export function exportProjectReport(query) {
  return request({
    url: '/system/projectReport/export',
    method: 'get',
    params: query
  })
}