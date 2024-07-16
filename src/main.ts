import { createApp } from 'vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@/assets/styles/index.scss'
import App from './App.vue'
import { router, setupRouter } from './router'
// import type { CustomModule } from './shared/types'
import { setupStore } from '@/store'
import { setupI18n } from '@/modules/i18n'

async function bootstrap() {
  console.log('%c DevTeam ', 'color:white;background-color:blue;', 'Showy')

  const app = createApp(App)

  // 挂载国际化
  setupI18n(app)

  // 挂载状态管理
  setupStore(app)

  // 挂载路由
  await setupRouter(app)

  // 安装目录`modules/`下的所有模块
  // Object.values(import.meta.glob<{ install: CustomModule }>('./modules/*.ts', { eager: true })).forEach(i => i.install?.(app))

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
