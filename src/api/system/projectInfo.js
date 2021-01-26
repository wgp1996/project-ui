import request from '@/utils/request'

// 查询项目建档列表
export function listProjectInfo(query) {
  return request({
    url: '/system/projectInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目人员明细列表
export function listProjectChild(projectCode) {
  return request({
    url: '/system/projectUser/list?projectCode='+projectCode,
    method: 'get',
  })
}

// 删除人员明细
export function delProjectUserInfo(id) {
  return request({
    url: '/system/projectUser/' + id,
    method: 'delete'
  })
}

// 查询附件明细列表
export function systemFileList(projectCode) {
  return request({
    url: '/system/systemFile/list?code='+projectCode,
    method: 'get',
  })
}

// 删除附件明细
export function delFileInfo(id) {
  return request({
    url: '/system/systemFile/' + id,
    method: 'delete'
  })
}


// 查询项目建档详细
export function getProjectInfo(id) {
  return request({
    url: '/system/projectInfo/' + id,
    method: 'get'
  })
}

// 查询项目建档详细
export function getProjectInfoByCode(code) {
  return request({
    url: '/system/projectInfo/getInfoByCode/' + code,
    method: 'get'
  })
}

// 新增项目建档
export function addProjectInfo(data) {
  return request({
    url: '/system/projectInfo',
    method: 'post',
    data: data
  })
}

// 修改项目建档
export function updateProjectInfo(data) {
  return request({
    url: '/system/projectInfo',
    method: 'put',
    data: data
  })
}

// 删除项目建档
export function delProjectInfo(id) {
  return request({
    url: '/system/projectInfo/' + id,
    method: 'delete'
  })
}

// 导出项目建档
export function exportProjectInfo(query) {
  return request({
    url: '/system/projectInfo/export',
    method: 'get',
    params: query
  })
}