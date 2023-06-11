import http from '../http'

function getCategoryList() {
  return http.get('category/list')
}

export default {
  getCategoryList
}
