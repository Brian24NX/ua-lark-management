import request from '@/utils/request'

// 分页查询店铺
export function page(data) {
  return request({
    url: '/admin/store/page',
    method: 'post',
    data: data
  })
}

// 保存或者修改店铺
export function save(data) {
  return request({
    url: '/admin/store/save',
    method: 'post',
    data: data
  })
}

// 下载学生学术账号
export function downExport(data) {
  return request({
    url: '/admin/store/export',
    method: 'post',
    data: data,
    responseType: 'blob',
  })
}
