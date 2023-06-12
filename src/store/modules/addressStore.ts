import { defineStore } from 'pinia'

export interface AddressStore {
  id?: number
}

const useAddressStore = defineStore({
  id: 'address',
  state: (): AddressStore => ({}),
  getters: {
    isEmpty: (state) => {
      return state.id === undefined
    },
    getId: (state) => {
      return state.id
    }
  },
  actions: {
    setAddress(id: number) {
      this.id = id
    }
  }
})

export default useAddressStore
