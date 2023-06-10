import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import UnoCSS from 'unocss/vite'
import TransformPages from 'uni-read-pages-vite'
import { viteMockServe } from 'vite-plugin-mock'

import { presetUno } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // https://github.com/antfu/unocss
    UnoCSS({ presets: [presetUno()] }),
    viteMockServe({
      logger: false,
      mockPath: './src/mock/'
    })
  ],
  define: {
    ROUTES: new TransformPages().routes // 注入路由表
  },
  server: {
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    // port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api/': {
        target:
          'https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      '/api-prod/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-prod/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  css: {
    // 配置`scss`和`less`全局变量
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/vars/_base.scss";'
      },
      less: {
        additionalData: '@import "@/styles/vars/_base.less";'
      }
    }
  }
})
