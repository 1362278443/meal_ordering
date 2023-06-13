import { defineStore } from 'pinia'

export interface AddressStore {
  id?: number
}

const useAddressStore = defineStore({
  id: 'address',
  state: (): AddressStore => ({}),
  getters: {
    isEmpty: (state): boolean => state.id === undefined,
    getId: (state) => state.id
  },
  actions: {
    setAddress(id: number) {
      console.log('setAddress', id)
      this.id = id
    }
  }
})

export default useAddressStore
