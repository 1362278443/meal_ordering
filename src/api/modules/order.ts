import http from '../http'

//提交订单
function submitOrder(order: Order) {
  return http.post('/order/submit', order)
}

//支付
function payOrder(order: Order) {
  return http.post('/order/pay', { order })
}

export default {
  submitOrder,
  payOrder
}
