import router from '@/router'
import http from '../http'

function getAddressList() {
  return http.get('addressBook/list')
}

//查询默认地址
function getDefaultAddress() {
  return http.get('addressBook/default')
}

//添加地址
function addAddress(address: Address) {
  return http.post('addressBook', address).then((res: any) => {
    router.back()
  })
}

//查询单个地址
function getAddress(id: number) {
  return http.get(`addressBook/${id}`)
}

//修改地址
function editAddress(address: Address) {
  return http.put(`addressBook/edit`, address)
}

//删除地址
function removeAddress(id: number) {
  return http.delete(`addressBook/remove`, {
    data: {
      id
    }
  })
}

export default {
  getAddressList,
  getDefaultAddress,
  addAddress,
  getAddress,
  editAddress,
  removeAddress
}
