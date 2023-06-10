import request from '@/utils/request'

// 分页查询供应商
export function page(data) {
  return request({
    url: '/admin/supplier/page',
    method: 'post',
    data: data
  })
}

// 保存或者修改供应商
export function save(data) {
  return request({
    url: '/admin/supplier/save',
    method: 'post',
    data: data
  })
}

// 获取物料详情
export function getDetail(data) {
  return request({
    url: '/admin/supplier/getDetail',
    method: 'post',
    data: data,
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/admin/supplier/resetPassword',
    method: 'post',
    data: data,
  })
}

// 删除供应商
export function deletes(data) {
  return request({
    url: '/admin/supplier/delete',
    method: 'post',
    data: data,
  })
}
