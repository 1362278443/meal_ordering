interface Flavors {
  id: number
  name: string
  value: []
  default_value: number
}

declare interface Dish {
  id: number
  name: string
  categroryId: number
  price: number
  code: string
  image: string
  description: string
  status: number
  number: number //商品数量
  flavors?: Array<Flavors>
}
