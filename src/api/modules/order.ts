import http from '../http'

function getDishList(categoryId: number) {
  return http.get<Array<Dish>>('dish/list', {
    params: {
      categoryId: categoryId
    }
  })
}

export default {
  getDishList
}
