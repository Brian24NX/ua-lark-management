import request from '@/utils/request'

export function categoryTree(id) {
  return request({
    url: '/admin/category/categoryTree',
    method: 'get'
  })
}
