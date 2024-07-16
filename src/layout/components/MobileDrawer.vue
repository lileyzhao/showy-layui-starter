<script setup lang="ts" name="Layout-MobileDrawer">
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { mapRoutesToElMenuItem } from '@/utils/menuUtil'
import { getFullRoutes } from '@/utils'

// Variables 变量
const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
const fullRoutes = getFullRoutes()

const drawerActive = ref(false)

/** Menu setting 菜单设置 */
const menuSetting = computed(() => app.MenuSetting)

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => menuSetting.value.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

/** Selected item in main menu 主栏菜单选中项 */
const mobileMenuKey = ref<string[]>()
const mobileMenuKeyOpen = ref<string[]>()

/** Main menu options 主栏菜单项 */
const mobileMenuItems = computed(() => {
  const routers = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []
  return routers.map(route => mapRoutesToElMenuItem(route, fullRoutes, t, true))
})

const show = () => {
  drawerActive.value = true
}

onMounted(() => {
  mobileMenuKey.value = [route.name as string]
  mobileMenuKeyOpen.value = [route.meta.parentName as string]
})

/** Exposes 公开对象 */
defineExpose({ show })
</script>

<template>
  <el-drawer
    v-if="app.isMobile" v-model="drawerActive" class="mobile-drawer" :size="menuSetting.mainMenu.widthMobile"
    direction="ltr" :with-header="false"
  >
    <template #footer>
      <div w-full>
        <el-button>Footer</el-button>
      </div>
    </template>
    <div style="border-bottom:1px solid rgba(255, 255, 255, 0.09);padding-left: 12px">
      <Logo flex-nowrap px-28px />
    </div>
    <el-menu class="b-r-none!" @select="drawerActive = false">
      <template #default>
        <component :is="menuItem" v-for="menuItem in mobileMenuItems" :key="menuItem.key" />
      </template>
    </el-menu>
    <div v-if="!app.IsDarkMode" absolute bottom-60px w-full flex justify-center>
      <div
        :class="`i-line-md:${mainMenuInverted ? 'sunny-filled hover:text-yellow text-white' : 'moon-filled hover:text-purple'}`"
        cursor-pointer text-18px @click="mainMenuInverted = !mainMenuInverted"
      />
    </div>
  </el-drawer>
</template>

<style>
.mobile-drawer .el-drawer__body {
  --uno: 'p-0!';
}
</style>
