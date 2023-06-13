//订单

declare interface Order {
  id?: number //订单id
  status: number //订单状态
  userId: number //用户id
  addressBookId: number //地址id
  payMethod: number //支付方式
  amount: number //订单金额
  remark: string //备注
  phone: string //手机号
  adress: string //地址
  consignee: string //收货人
}
