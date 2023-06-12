//订单

declare interface Order {
  id: number | undefined
  number: string //订单号
  status: number //订单状态
  user_id: number //用户id
  adress_book_id: number //地址id
  pay_method: number //支付方式
  amount: number //订单金额
  phone: string //手机号
  adress: string //地址
}
