import request from '@/utils/request'

// 查询部门列表
export function listEnginnerDept(query) {
  return request({
    url: '/system/enginnerDept/list',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getEnginnerDept(deptId) {
  return request({
    url: '/system/enginnerDept/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addEnginnerDept(data) {
  return request({
    url: '/system/enginnerDept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateEnginnerDept(data) {
  return request({
    url: '/system/enginnerDept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delEnginnerDept(deptId) {
  return request({
    url: '/system/enginnerDept/' + deptId,
    method: 'delete'
  })
}

// 导出部门
export function exportEnginnerDept(query) {
  return request({
    url: '/system/enginnerDept/export',
    method: 'get',
    params: query
  })
}