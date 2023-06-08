declare interface Cart {
  id: number
  cate_id: number
  name: string
  image: string
  user_id: number
  dish_id: number
  setmeal_id: number
  dish_flavor: Array<string>
  number: number
  amount: number
}
