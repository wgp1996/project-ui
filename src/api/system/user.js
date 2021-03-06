import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
//发送验证码
export function sendSms(phone) {
  return request({
    url: '/api/sendSms/'+phone,
    method: 'get'
  })
}
//获取openId
export function getOpenId(code) {
  return request({
    url: '/wx/api/getOpenId/'+code,
    method: 'get'
  })
}
//检测是否绑定微信
export function checkBind(code) {
  return request({
    url: '/wx/api/checkBind/'+code,
    method: 'get'
  })
}
//绑定微信
export function wxBind(openId,SMSCode,userName) {
  return request({
    url: '/wx/api/wxBind/'+openId+'/'+SMSCode+'/'+userName,
    method: 'get'
  })
}



// 查询用户审核列表
export function listShUser(query) {
  return request({
    url: '/system/user/shList',
    method: 'get',
    params: query
  })
}
// 查询下拉用户列表
export function getAllUser(query) {
  return request({
    url: '/system/user/getAll',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function allListUser(query) {
  return request({
    url: '/system/user/allList',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}
// 注册用户
export function registerUser(data) {
  return request({
    url: '/system/user/register',
    method: 'post',
    data: data
  })
}


// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
