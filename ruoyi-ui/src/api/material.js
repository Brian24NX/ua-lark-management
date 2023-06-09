import request from '@/utils/request'

export function getTree(id) {
  return request({
    url: '/admin/category/categoryTree',
    method: 'get'
  })
}

// 新增
export function add(data) {
  return request({
    url: '/admin/category/add',
    method: 'post',
    data: data
  })
}

// 删除
export function del(cids) {
  return request({
    url: '/admin/category/delCategory/' + cids,
    method: 'delete',
  })
}

// 更新
export function edit(data) {
  return request({
    url: '/admin/category/editCategory',
    method: 'put',
    data: data
  })
}
