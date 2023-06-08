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
            id: 21,
            name: 'aaa',
            categrory_id: 1,
            price: 111,
            code: '11',
            image:
              'https://img-shop.qmimg.cn/s23107/2020/04/29/4a62ee45dd527609ed.jpg?imageView2/2/w/400/h/400',
            description: 'aaaaaa',
            status: 1,
            use_property: false,
            number: 1,
            flavors: [
              {
                id: 12,
                name: 'aaa',
                value: ['aaa', 'bbb']
              }
            ]
          },
          {
            id: 2,
            name: 'bbbb',
            categrory_id: 1,
            price: 111,
            code: '11',
            image:
              'https://img-shop.qmimg.cn/s23107/2020/04/29/4a62ee45dd527609ed.jpg?imageView2/2/w/400/h/400',
            description: 'aaaaaa',
            status: 1,
            use_property: true,
            number: 1,
            flavors: [
              {
                id: 15,
                name: 'aaa',
                value: ['aaa', 'bbb'],
                default_value: 0
              },
              {
                id: 13,
                name: 'aaababba',
                value: ['ccc', 'ddd'],
                default_value: 1
              }
            ]
          }
        ]
      }
    }
  }
] as MockMethod[]
