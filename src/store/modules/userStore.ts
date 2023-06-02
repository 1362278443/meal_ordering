import { defineStore } from 'pinia'

interface userStore {
  id?: string | number
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): userStore => ({}),
  getters: {},
  actions: {}
})
