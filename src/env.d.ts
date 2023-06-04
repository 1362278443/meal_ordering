/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_AXIOS_BASE_URL: string
}

declare module 'uview-plus' {
  export function install(): void

  interface test {
    /** 邮箱格式校验 */
    email(email: string): boolean
    /** 手机号码格式校验 */
    mobile(mobile: string): boolean
  }
  interface $u {
    [x: string]: any
    test: test
    color: [x: string]
  }

  global {
    interface Uni {
      $u: $u
    }
  }
}
