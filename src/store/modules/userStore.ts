import { defineStore } from 'pinia'

interface userStore {
  id?: number
  name?: string
  phone?: string
  sex?: string
  idNumber?: string
}

const useUserStore = defineStore({
  id: 'user',
  state: (): userStore => ({}),
  getters: {},
  actions: {
    setUserInfo(userInfo: userStore) {
      this.id = userInfo.id
      this.name = userInfo.name
      this.phone = userInfo.phone
      this.sex = userInfo.phone
      this.idNumber = userInfo.idNumber
    }
  }
})

export default useUserStore
