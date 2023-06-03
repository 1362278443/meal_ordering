import { defineStore } from 'pinia'

interface userStore {
  id?: string | number
}

const useUserStore = defineStore({
  id: 'user',
  state: (): userStore => ({}),
  getters: {},
  actions: {}
})

export default useUserStore
