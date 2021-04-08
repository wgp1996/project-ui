import request from '@/utils/request'

// 查询库存管理列表
export function listStockInfo(query) {
  return request({
    url: '/system/stockInfo/list',
    method: 'get',
    params: query
  })
}

// 领料出库查询库存管理列表
export function listStockInfoByCk(query) {
  return request({
    url: '/system/stockInfo/ckList',
    method: 'get',
    params: query
  })
}

// 查询库存管理详细
export function getStockInfo(id) {
  return request({
    url: '/system/stockInfo/' + id,
    method: 'get'
  })
}

// 新增库存管理
export function addStockInfo(data) {
  return request({
    url: '/system/stockInfo',
    method: 'post',
    data: data
  })
}

// 修改库存管理
export function updateStockInfo(data) {
  return request({
    url: '/system/stockInfo',
    method: 'put',
    data: data
  })
}

// 删除库存管理
export function delStockInfo(id) {
  return request({
    url: '/system/stockInfo/' + id,
    method: 'delete'
  })
}

// 导出库存管理
export function exportStockInfo(query) {
  return request({
    url: '/system/stockInfo/export',
    method: 'get',
    params: query
  })
}