<script setup lang="ts" name="Layout-Index">
import { useDebounceFn } from '@vueuse/core'
import MainSidebar from './components/MainSidebar.vue'
import SubSidebar from './components/SubSidebar.vue'
import ThemeDrawer from './components/ThemeDrawer.vue'
import MobileDrawer from './components/MobileDrawer.vue'
import TopBar from './components/TopBar.vue'
import { useAppStore } from '@/store'
import { ScreenEnum } from '@/shared'
import { getFullRoutes } from '@/utils'

const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()

const mountTimeout = ref<any[]>([])
const stopTimeout = ref<boolean>(false)
const mainSidebarRef = ref<InstanceType<typeof MainSidebar>>()
const subSidebarRef = ref<InstanceType<typeof SubSidebar>>()
const topBarRef = ref<InstanceType<typeof TopBar>>()
const mobileDrawerRef = ref<InstanceType<typeof MobileDrawer>>()
const themeDrawerRef = ref<InstanceType<typeof ThemeDrawer>>()

/** Selected item in the main menu. 主栏菜单选中项。 */
const mainMenuKey = ref<string>()

/** Root route name of the main menu. 主菜单的根路由名。 */
const mainMenuRootKey = computed(() => {
  const findRootRoute = (parentName: string): string | undefined => {
    const parentRoute = fullRoutes.find(r => r.name === parentName)
    if (!parentRoute || parentRoute.name === 'root' || parentRoute.meta.parentName === 'root')
      return parentName

    return findRootRoute(parentRoute.meta.parentName as string)
  }

  const currRoute = fullRoutes.find(r => r.name === mainMenuKey.value)
  if (!currRoute)
    return route.matched[1].name as string
  else if (currRoute.meta.parentName === 'root')
    return currRoute.name as string
  else return findRootRoute(currRoute.meta.parentName as string)
})

/** Restore the sub-menu when the mouse enters the content area. 复原副栏菜单(当鼠标移入内容区时)。 */
const restoreSubMenu = useDebounceFn(() => {
  const tt = setTimeout(() => {
    if (stopTimeout.value)
      return
    if (!app.MenuSetting.subMenu.collapsed) {
      if (!app.isMobile && !app.IsTopBar)
        mainSidebarRef.value?.refreshMainMenu()
      else if (!app.isMobile)
        topBarRef.value?.refreshTopMenu()
    }
  }, 700)
  mountTimeout.value?.push(tt)
}, 350)

/** Cancel the restore of the sub-menu. 取消复原副栏菜单。 */
const cancelRestoreSubMenu = () => {
  stopTimeout.value = true
  while (mountTimeout.value.length > 0) {
    const tt = mountTimeout.value.shift()
    clearTimeout(tt)
  }
}

/** Main menu selected item changed. 主栏菜单选中项改变。 */
const handleMainMenuChange = (key: string) => {
  if (mainMenuKey.value === key)
    return
  mainMenuKey.value = key
  subSidebarRef.value?.refreshSubMenu()
  cancelRestoreSubMenu()
}

/** Trigger mobile mode. 触发移动端模式。 */
const triggerMobileMode = () => {
  if (document.body.clientWidth <= ScreenEnum.MD)
    app.isMobile = true
  else app.isMobile = false
}

onMounted(async () => {
  // Trigger mobile detection and add a listener. 触发移动端检测并添加监听事件。
  triggerMobileMode()
  window.addEventListener('resize', triggerMobileMode)

  // Update the main menu. 更新主栏菜单。
  // mainMenuKey.value = (app.MenuSetting.subMenu.collapsed ? route.name : route.matched[1].name) as string
})

onUnmounted(() => {
  window.removeEventListener('resize', triggerMobileMode)
})

/** Handle various actions like toggling drawers. 处理各种操作，如切换抽屉。 */
const handleAction = (op: string, _val: any) => {
  if (op === 'toggleMobileDrawer')
    mobileDrawerRef.value?.show()
  else if (op === 'toggleThemeDrawer')
    themeDrawerRef.value?.show()
}
</script>

<template>
  <lay-layout has-sider style="min-height: 100vh">
    <!-- Sidebar (Desktop): Main Sidebar. 侧边栏(电脑端):主栏。 -->
    <MainSidebar
      ref="mainSidebarRef" @menu-change="handleMainMenuChange" @mouseenter="cancelRestoreSubMenu"
      @mouseleave="stopTimeout = false"
    />
    <!-- Sidebar (Desktop): Sub Sidebar. 侧边栏(电脑端):副栏。 -->
    <SubSidebar
      ref="subSidebarRef" :parent-menu-key="mainMenuRootKey" @mouseenter="cancelRestoreSubMenu"
      @mouseleave="stopTimeout = false"
    />
    <!-- Right main area. 右侧主体区。 -->
    <lay-layout class="h-100vh flex flex-col!">
      <!-- Top bar area. 头部横栏区。 -->
      <TopBar
        ref="topBarRef" @action="handleAction" @key-change="handleMainMenuChange"
        @mouseenter="cancelRestoreSubMenu" @mouseleave="stopTimeout = false"
      />
      <!-- Content area. 内容区。 -->
      <lay-body id="app-main-content" flex-1 of-y-scroll p-0 @mouseenter="restoreSubMenu">
        <div p-12px>
          <router-view v-slot="{ Component, route: r }">
            <transition name="fade">
              <keep-alive :max="25">
                <component :is="Component" :key="r.fullPath" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
        <el-backtop target="#app-main-content" :visibility-height="100" />
      </lay-body>
    </lay-layout>
    <!-- Drawer (Mobile). 抽屉栏(手机端)。 -->
    <MobileDrawer ref="mobileDrawerRef" />
    <!-- Theme settings drawer. 主题设置抽屉栏。 -->
    <ThemeDrawer ref="themeDrawerRef" />
  </lay-layout>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
