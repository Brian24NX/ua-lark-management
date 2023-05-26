import request from '@/utils/request'

export function add(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center',
    method: 'post',
    data: data
  })
}

// 获取服务网点信息查询分页结果接口
export function pageSearch(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center/page/search',
    method: 'post',
    data: data
  })
}

// 删除服务网点信息接口
export function deleteCenterId(centerId) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center/' + centerId,
    method: 'delete',
  })
}

// 根据ID获取服务网点信息接口
export function getServiceDetail(centerId) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center/' + centerId,
    method: 'get',
  })
}

export function edit(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'service-center/' + data.centerId,
    method: 'put',
    data: data
  })
}




// 1111111111111111111111

export function page(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'activity/page',
    method: 'post',
    data: data
  })
}


// 批量驳回同意
export function activityUpdateServe(data, status) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'customer-activity/info/update?status=' + status,
    method: 'post',
    data: [1,2]
  })
}

// 下载校车申请列表
export function downApplicationList(data) {
  return request({
    url: process.env.VUE_APP_HVAC_PATH + 'customer-activity/out-info/export',
    method: 'get',
    responseType: 'blob',
  })
}
