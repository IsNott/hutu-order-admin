// if (process.env.NODE_ENV === 'development') {
//   import('./mock').then(({ default: mock }) => { 
//     console.log('mock启动成功');
//   })
// }
import { createApp } from 'vue'
import('./mock')
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')
