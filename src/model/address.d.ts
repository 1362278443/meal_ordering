declare interface Address {
  id?: number
  userId?: number
  consignee?: string //收货人
  sex?: number //性别
  phone?: number //电话
  detail?: string //详细地址
  label?: string //标签
  isDefault?: boolean //是否默认
}
