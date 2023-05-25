import request from '@/utils/hvacRequest'

export function getProvinceListServe(parentId) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center/area/' + parentId + '/sub/list',
    method: 'get'
  })
}

// 新增和编辑
export function addAndUpdate(url, data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'activity/' + url,
    method: 'post',
    data: data
  })
}

// export function update(data) {
//   return request({
//     url: process.env.VUE_APP_HVAC_PATH + 'activity/update',
//     method: 'post',
//     data: data
//   })
// }

export function page(data) {
  return request({
    url: process.env.VUE_APP_ADMIN_PATH + 'activity/page',
    method: 'post',
    data: data
  })
}

export function detail(id) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'activity/get?id=' + id,
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'activity/del?id=' + data.id,
    method: 'post',
    data: data
  })
}

export function publish(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'activity/publish',
    method: 'post',
    data: data
  })
}

// 服务网点根据上级节点ID查询地区信息列表
export function customerPage(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'customer-activity/customer',
    method: 'post',
    data: data
  })
}

// 批量驳回同意
export function activityUpdateServe(data, status) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'customer-activity/info/update?status=' + status,
    method: 'post',
    data: data
  })
}

// 下载校车申请列表
export function downApplicationList(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'customer-activity/out-info/export?' + data,
    method: 'get',
    data: data,
    responseType: 'blob'
  })
}

// 获取员工信息分页查询结果接口--在活动页面白名单调用
export function wecommemberapiServe(data) {
  return request({
    url: process.env.VUE_APP_WECOM_PATH + 'employee/activity/search/page',
    method: 'post',
    data: data
  })
}

// 获取员工信息分页查询结果接口--在企微人员调用
export function employeeapiServe(data) {
  return request({
    url: process.env.VUE_APP_WECOM_PATH + 'employee/search/page',
    method: 'post',
    data: data
  })
}

// 更改员工license状态接口
export function employeelicense(data) {
  return request({
    url: process.env.VUE_APP_WECOM_PATH + 'employee/' + data.employeeId + '/license/' + data.licenseType,
    method: 'post',
    data: data
  })
}

// 禁用员工企业微信接口
export function wecomstatusdisable(data) {
  return request({
    url: process.env.VUE_APP_WECOM_PATH + 'employee/' + data.employeeId + '/wecom-status/disable',
    method: 'post',
    data: data
  })
}


export function employeecountstats(id) {
  return request({
    url: process.env.VUE_APP_WECOM_PATH + 'employee/count/stats',
    method: 'get'
  })
}
