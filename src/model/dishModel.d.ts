interface Flavors {
  id: number
  name: string
  value: []
  default_value: number
}

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
  number: number
  flavors?: Array<Flavors>
}
