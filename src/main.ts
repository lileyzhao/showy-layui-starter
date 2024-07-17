import { createApp } from 'vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@/assets/styles/index.scss'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from '@/store'

async function bootstrap() {
  console.log('%c DevTeam ', 'color:white;background-color:blue;', 'Showy Layui Template')

  const app = createApp(App)

  // 挂载状态管理
  setupStore(app)

  // 挂载路由
  await setupRouter(app)

  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/Router.html#isReady
  await router.isReady()

  // 应用挂载后移除加载效果
  app.mount('#app').$nextTick(() => {
    const loadingElement = document.getElementById('loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }
  })
}

// 执行应用设置
bootstrap()
