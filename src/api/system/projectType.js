import request from '@/utils/request'

// 查询项目分类列表
export function listProjectType(query) {
  return request({
    url: '/system/projectType/list',
    method: 'get',
    params: query
  })
}

// 查询项目分类树
export function projectTypeTree(query) {
  return request({
    url: '/system/projectType/treeselect',
    method: 'get',
    params: query
  })
}



// 查询项目分类详细
export function getProjectType(projectTypeId) {
  return request({
    url: '/system/projectType/' + projectTypeId,
    method: 'get'
  })
}

// 新增项目分类
export function addProjectType(data) {
  return request({
    url: '/system/projectType',
    method: 'post',
    data: data
  })
}

// 修改项目分类
export function updateProjectType(data) {
  return request({
    url: '/system/projectType',
    method: 'put',
    data: data
  })
}

// 删除项目分类
export function delProjectType(projectTypeId) {
  return request({
    url: '/system/projectType/' + projectTypeId,
    method: 'delete'
  })
}

// 导出项目分类
export function exportProjectType(query) {
  return request({
    url: '/system/projectType/export',
    method: 'get',
    params: query
  })
}