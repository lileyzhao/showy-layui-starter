<script setup lang="ts" name="Layout-SubSidebar">
import { useAppStore } from '@/store'
import Logo from '@/layout/components/Logo.vue'
import { MenuPositionEnum } from '@/shared'
import { mapRoutesToElMenuItem } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

const props = defineProps({ parentMenuKey: { type: String, required: false } })

// Variables 变量
const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()

/** Selected Item in sub-menu 副栏菜单选中项 */
const subMenuKey = ref<string | undefined>(route.name as string)

const subMenuRoutes = computed(() => {
  return props.parentMenuKey ? fullRoutes.filter(r => r.meta.parentName === (props.parentMenuKey || route.matched[1].name)) : []
})

/** sub-menu items 副栏菜单项 */
const subMenuItems = computed(() => {
  if ((!app.MenuSetting.subMenu.collapsed || app.MenuSetting.topMenu.showSubMenu) && subMenuRoutes.value.length > 0)
    return fullRoutes.filter(route => route.meta.parentName === props.parentMenuKey).map(route => mapRoutesToElMenuItem(route, fullRoutes, t, true))
  else return []
})

/** Refresh main menu 刷新副栏菜单 */
const refreshSubMenu = () => {
  // This is to manage the selected item by forcing a refresh of the menu component
  // 这里是为了强制刷新菜单组件来达到控制选中项
  subMenuKey.value = undefined
  nextTick(() => {
    subMenuKey.value = route.name as string
  })
}

/** Collapsed State of sub-menu 副栏菜单收缩状态 */
const collSubMenu = computed({
  get: () => app.MenuSetting.subMenu.collapsed,
  set: (val) => {
    if (app.MenuSetting.subMenu.collapsed !== val)
      app.setMenuSetting({ subMenu: { collapsed: val } })
  },
})

const visible = computed(() => {
  if (app.isMobile)
    return false
  else if (app.MenuSetting.menuPosition === MenuPositionEnum.TOP_BAR)
    return app.MenuSetting.topMenu.showSubMenu && subMenuRoutes.value.length > 0
  else
    return !app.MenuSetting.subMenu.collapsed && subMenuRoutes.value.length > 0
})

const visibleLogo = computed(() => app.MenuSetting.menuPosition === MenuPositionEnum.TOP_BAR && app.MenuSetting.topMenu.showSubMenu)

/** Exposes 公开对象 */
defineExpose({ refreshSubMenu })
</script>

<template>
  <!-- Sidebar (desktop): Sub-sidebar 侧边栏(电脑端):副栏 -->
  <el-aside
    v-if="visible" :width="`${app.MenuSetting.subMenu.width}px`" class="h-100vh of-x-hidden!"
    style="border-right:1px solid var(--el-border-color);"
  >
    <el-container class="h-full">
      <el-header class="h-auto! p-0!" style="border-bottom:1px solid var(--el-border-color);">
        <Logo v-if="visibleLogo" p-l-6 />
        <Logo v-else hide-logo :hide-title="!app.MenuSetting.mainMenu.collapsed" p-l-6 />
      </el-header>
      <el-main class="p-0!">
        <!-- Sub-menu 副栏菜单 -->
        <el-menu v-if="subMenuKey" class="sub-menu" unique-opened :default-active="subMenuKey">
          <template #default>
            <component :is="menuItem" v-for="menuItem in subMenuItems" :key="menuItem.key" />
          </template>
        </el-menu>
      </el-main>
      <el-footer class="h-auto! px-0!">
        <div h-8 w-full flex justify-right p-r-2>
          <div
            class="i-carbon:side-panel-close cursor-pointer text-5 hover:color-primary"
            @click="collSubMenu = !collSubMenu"
          />
        </div>
      </el-footer>
    </el-container>
  </el-aside>
</template>

<style scoped lang="scss">
:deep(.sub-menu.el-menu) {
  --uno: 'b-r-none!';

  .el-menu-item {
    --uno: 'p-r-0!';

    a {
      --uno: 'w-full';
    }
  }
}
</style>
