import http from '../http'

function getSetmealList(categoryId: number) {
  return http.get<Array<Dish>>('setmeal/list', {
    params: {
      categoryId: categoryId
    }
  })
}

export default {
  getSetmealList
}
