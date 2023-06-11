import http from '../http'

//获取购物车列表
function getCartList() {
  return http.get('shoppingCart/list')
}

//添加购物车
function addCart(cart: Cart) {
  return http.post('shoppingCart/add', cart)
}

//删除购物车
function subCart(cart: Cart) {
  return http.post('shoppingCart/sub', cart)
}

//清空购物车
function clearCart() {
  return http.delete('shoppingCart/clean')
}

export default {
  getCartList,
  addCart,
  subCart,
  clearCart
}
