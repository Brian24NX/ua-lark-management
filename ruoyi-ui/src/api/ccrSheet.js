import request from '@/utils/hvacRequest'

// 问题一级分类接口
export function ccrproblemCategoryListApi(query) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/problemCategoryList',
    method: 'get',
    params: query
  })
}

// 问题二级分类接口
export function ccrproblemDescriptionListApi(query) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/problemDescriptionList',
    method: 'get',
    params: query
  })
}

// 获取产品类型接口
export function ccrproductTypeListApi(query) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/productTypeList',
    method: 'get',
    params: query
  })
}

// CCR列表下载
export function ccrdownloadFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/downloadFeedbackList',
    method: 'post',
    responseType: 'blob',
  })
}

// 市场品质部接口
export function ccrmarketFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/marketFeedbackList?queryType=' + data.queryType,
    method: 'post',
    data: data
  })
}

// 运营质量部接口
export function ccroperationFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/operationFeedbackList?queryType=' + data.queryType,
    method: 'post',
    data: data
  })
}

// 服务部接口
export function ccrserviceFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/serviceFeedbackList?queryType=' + data.queryType,
    method: 'post',
    data: data
  })
}

// 责任部门接口
export function ccrresponseDeptFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/responseDeptFeedbackList?queryType=' + data.queryType,
    method: 'post',
    data: data
  })
}

// 质量委员会部门接口
export function ccrpresidentFeedbackListApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/presidentFeedbackList?queryType=' + data.queryType,
    method: 'post',
    data: data
  })
}

// 查询详情接口
export function ccrqueryFeedbackDetailsApi(ccrId) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'queryFeedbackDetails?ccrId=' + ccrId,
    method: 'get',
  })
}

// 上传文件
export function ccrUploadFileApi(type, data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccrUploadFile/' + type,
    method: 'post',
    data: data
  })
}

// 查询工单历史操作列表
export function ccrTicketHistoryListApi(ccrId) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccrTicketHistoryList?ccrId=' + ccrId,
    method: 'get',
  })
}

// 市场品质部门提交表单接口
export function submitApi(url, data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + url,
    method: 'post',
    data: data
  })
}

// 责任部门列表
export function ccrresponsibleDepartmentListApi(ccrId) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'responsibleDepartmentList',
    method: 'get',
  })
}

// 缺陷分类列表
export function ccrdefectClassificationListApi(ccrId) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'defectClassificationList',
    method: 'get',
  })
}

// 查询反馈单总数
export function ccrgetFeedBackCountApi(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'ccr/getFeedBackCount',
    method: 'post',
    data: data
  })
}

// 费用归属列表
export function searchCostAttributionEnumListApi(ccrId) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'searchCostAttributionEnumList',
    method: 'get',
  })
}
