import { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/api/cate',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        data: [
          {
            id: 1,
            type: 1,
            name: 'aaa',
            sort: 1
          },
          {
            id: 2,
            type: 2,
            name: 'bbb',
            sort: 2
          }
        ]
      }
    }
  },
  {
    url: '/api/goods',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        data: [
          {
            id: 1,
            name: 'aaa',
            categrory_id: 1,
            price: 111,
            code: 1,
            image: 1,
            description: 'aaaaaa',
            status: 1,
            use_property: '1',
            flavors: {
              id: 12,
              name: 'aaa',
              value: ['aaa', 'bbb']
            }
          },
          {
            id: 2,
            name: 'bbbb',
            categrory_id: 1,
            price: 111,
            code: 1,
            image: 1,
            description: 'aaaaaa',
            status: 1,
            use_property: '1',
            flavors: {
              id: 12,
              name: 'aaa',
              value: ['aaa', 'bbb']
            }
          }
        ]
      }
    }
  }
] as MockMethod[]
