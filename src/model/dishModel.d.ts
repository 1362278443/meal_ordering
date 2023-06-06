declare interface Dish {
  id: number
  name: string
  categrory_id: number
  price: number
  code: string
  image: string
  description: string
  status: number
  use_property: boolean
  flavors?: {
    id: number
    name: string
    value: []
  }
}
