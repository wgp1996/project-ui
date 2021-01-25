import request from '@/utils/request'

// 查询岗位列表
export function listProjectTypePost(query) {
  return request({
    url: '/system/projectTypePost/list',
    method: 'get',
    params: query
  })
}

// 查询岗位树
export function projectTypeTree(query) {
  return request({
    url: '/system/projectTypePost/treeselect',
    method: 'get',
    params: query
  })
}



// 查询岗位详细
export function getProjectType(projectTypeId) {
  return request({
    url: '/system/projectTypePost/' + projectTypeId,
    method: 'get'
  })
}

// 新增岗位
export function addProjectType(data) {
  return request({
    url: '/system/projectTypePost',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateProjectType(data) {
  return request({
    url: '/system/projectTypePost',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delProjectType(projectTypeId) {
  return request({
    url: '/system/projectTypePost/' + projectTypeId,
    method: 'delete'
  })
}

// 导出岗位
export function exportProjectType(query) {
  return request({
    url: '/system/projectTypePost/export',
    method: 'get',
    params: query
  })
}