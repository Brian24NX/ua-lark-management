import request from '@/utils/request'

//   import { faqList, faqAdd, faqDel, faqEdit, faqDetail, faqEditRelations, faqActive } from '@/api/faq'

export function faqList(params) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'getFaqList?'  + params,
    method: 'get',
  })
}

// faq添加
export function faqAdd(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqAdd',
    method: 'post',
    data
  })
}

// faq删除
export function faqDel(id) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqDelete?id=' + id,
    method: 'get',
  })
}

// faq问题修改
export function faqEdit(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqEdit',
    method: 'post',
    data
  })
}

// faq问题修改
export function faqEditRelations(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqRelationEdit',
    method: 'post',
    data
  })
}

// faq详情
export function faqDetail(id) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'getFaqById?questionId=' + id,
    method: 'get',
  })
}

// faq激活和不激活
export function faqActive(data) {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqActive',
    method: 'post',
    data
  })
}

// faq模板下载
export function faqTemplateDownload() {
  return request({
    url: process.env.VUE_APP_CCR_PATH + 'faqTemplateDownload',
    method: 'get'
  })
}
