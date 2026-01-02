import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// import { indexContent } from './api/index'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      // 自定义插入位置
      inject: 'body-last',
      // 自定义dom id
      customDomId: '__svg__icons__dom__',
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 10333,
    hmr: {
      overlay: false
    },
    proxy: {
      '^/api': {
        target: `http://127.0.0.1:10220/hutu-admin`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      // 静态文件
      '^/static': {
        target: 'http://127.0.0.1:10220',
        changeOrigin: true,

      },
      '^/upload': {
        target: 'http://127.0.0.1:10220/hutu-oss',
        rewrite: path => path.replace(/^\/upload/, ''),
        changeOrigin: true,
      }
    }
  }
})
