<script setup lang="ts" name="Layout-MainSidebar">
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { mapRoutesToLayMenuItemMain } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

const emit = defineEmits(['menuChange'])

const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()
const mainMenuRoutes = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []

/** Selected Item in main-menu 主栏菜单选中项 */
const mainMenuKey = ref<string>()
const mainMenuOpenKeys = ref([])

/** Collapsed State of main-menu 主栏菜单收缩状态 */
const collMainMenu = computed({
  get: () => app.MenuSetting.mainMenu.collapsed,
  set: val => app.setMenuSetting({ mainMenu: { collapsed: val } }),
})

/** Collapsed State of sub-menu 副栏菜单收缩状态 */
const collSubMenu = computed({
  get: () => app.MenuSetting.subMenu.collapsed,
  set: (val) => {
    if (app.MenuSetting.subMenu.collapsed !== val)
      app.setMenuSetting({ subMenu: { collapsed: val } })
  },
})

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => app.MenuSetting.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

/** main-menu item 主栏菜单项 */
const mainMenuItems = computed(() => {
  return mainMenuRoutes.map(route => mapRoutesToLayMenuItemMain(route, fullRoutes, t, app.MenuSetting.subMenu.collapsed, app.MenuSetting.mainMenu))
})

/** Handle main menu key change 处理主菜单键变化 */
const handleMainMenuChange = (key: string) => emit('menuChange', key)

/** Refresh main menu 刷新主菜单 */
const refreshMainMenu = () => {
  // This is to manage the selected item by forcing a refresh of the menu component
  // 这里是为了强制刷新菜单组件来达到控制选中项
  mainMenuKey.value = undefined
  nextTick(() => {
    mainMenuKey.value = (app.MenuSetting.subMenu.collapsed ? route.name : route.matched[1].name) as string
    handleMainMenuChange(mainMenuKey.value)
  })
}

const visible = computed(() => !app.isMobile && !app.IsTopBar)

onMounted(refreshMainMenu)

watch(() => app.MenuSetting.subMenu.collapsed, refreshMainMenu)

/** Exposes 公开对象 */
defineExpose({ refreshMainMenu })
</script>

<template>
  <!-- Sidebar (Desktop): Main Column 侧边栏(电脑端):主栏 -->
  <lay-side
    v-if="visible"
    :width="`${collMainMenu ? app.MenuSetting.mainMenu.widthColl : app.MenuSetting.subMenu.collapsed ? app.MenuSetting.mainMenu.widthSingle : app.MenuSetting.mainMenu.width}px`"
    style="height:100vh;border-right:1px solid var(--lay-border-color);z-index:1;"
  >
    <lay-layout class="h-full">
      <lay-header
        :style="{
          backgroundColor: mainMenuInverted ? 'var(--lay-bg-color-dark)' : 'transparent',
          padding: 0,
          height: 'auto',
          lineHeight: 'auto',
          borderBottom: mainMenuInverted && !app.IsDarkMode ? '1px solid var(--lay-border-color-dark)' : `1px solid var(--lay-border-color)`,
        }"
      >
        <Logo w-full :hide-title="collMainMenu" />
      </lay-header>
      <!-- Main Menu 主栏菜单 -->
      <lay-body class="of-x-hidden! p0!">
        <lay-menu
          v-if="mainMenuKey" v-model:selectedKey="mainMenuKey" v-model:open-keys="mainMenuOpenKeys"
          class="main-menu h-full! w-full!" :collapse="collMainMenu" :tree="true" indent
          theme="light" @change-selected-key="handleMainMenuChange"
        >
          <template #default>
            <component :is="menuItem" v-for="menuItem in mainMenuItems" :key="menuItem.key" />
          </template>
        </lay-menu>
      </lay-body>
      <lay-footer
        class="h-auto! px-0!"
        :style="`background-color:${mainMenuInverted ? 'var(--lay-bg-color-dark)' : 'transparent'};`"
      >
        <div :class="`h-8 ${collMainMenu ? 'flex justify-around' : 'relative w-full'}`">
          <div
            v-if="!app.IsDarkMode"
            :class="`${!collMainMenu && 'left-50% -translate-x-1/2 absolute'} i-line-md:${mainMenuInverted ? 'sunny-filled text-white' : 'moon-filled'}  hover:color-primary`"
            cursor-pointer text-5 @click="mainMenuInverted = !mainMenuInverted"
          />
          <div
            v-if="collSubMenu"
            :class="`${!collMainMenu && 'right-2 absolute'} i-carbon:side-panel-open hover:color-primary ${mainMenuInverted && 'text-white'}`"
            cursor-pointer text-5 @click="collSubMenu = !collSubMenu"
          />
        </div>
      </lay-footer>
    </lay-layout>
  </lay-side>
</template>

<style scoped lang="scss">
:deep(.main-menu.layui-nav) {
  .layui-nav-item > a {
    padding: 0;
    display: flex;

    span {
      --uno: 'flex-1 m-0';
      display: flex;
      align-items: center;
      padding-left: 23px;
      a {
        display: flex;
        align-items: center;
      }

      span {
        display: inline-block;
        padding-left: 11.5px;
      }
    }
    > i {
      padding: 0;
    }
  }
}
</style>
