<script setup lang="ts" name="Layout-TopBar">
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { MENU_STATE_TEXT, MenuButtonEnum } from '@/shared'
import ActionIcon from '@/layout/components/ActionIcon.vue'
import { mapRoutesToElMenuItem } from '@/utils/menuUtil'
import { availableLocales } from '@/utils/i18nUtil'
import { getFullRoutes } from '@/utils'

const emit = defineEmits(['action', 'keyChange'])

// Variables 变量
const { t } = useI18n()
const app = useAppStore()
const router = useRouter()
const route = useRoute()
const fullRoutes = getFullRoutes()

/** Menu setting 菜单设置 */
const menuSetting = computed(() => app.MenuSetting)

/** Whether to show main menu status switch button 是否显示主菜单状态切换按钮 */
const showMainMenuStatusButton = computed(() => menuSetting.value.buttons.includes(MenuButtonEnum.MainMenuStatus))

/** Selected item in top menu 顶栏菜单选中项 */
const topMenuKey = ref<string | undefined>()

/** Top menu items 顶栏菜单项 */
const topMenuItems = computed(() => {
  const routers = fullRoutes.filter(route => route.meta.parentName === 'root').filter(route => !route.meta?.hidden) ?? []
  return routers.map(route => mapRoutesToElMenuItem(route, fullRoutes, t, !menuSetting.value.topMenu.showSubMenu))
})

/** Menu state switch icon 菜单状态切换图标 */
const menuStateIcon = computed(() => {
  const menuIconMap = { 1: 'i-line-md:download-off-outline', 2: 'i-line-md:menu-fold-right', 3: 'i-line-md:menu-unfold-left' }
  return app.isMobile ? 'i-line-md:menu-fold-right' : menuIconMap[menuSetting.value.menuState!] || ''
})

/** Toggle main-menu status 切换主栏菜单状态 */
const toggleMainMenu = () => app.isMobile ? emit('action', 'toggleMobileDrawer') : app.toggleMainMenuState()

const refreshTopMenu = () => {
  // This is to manage the selected item by forcing a refresh of the menu component
  // 这里是为了强制刷新菜单组件来达到控制选中项
  topMenuKey.value = undefined
  nextTick(() => {
    topMenuKey.value = (menuSetting.value.topMenu.showSubMenu ? route.matched[1].name : route.name) as string
    emit('keyChange', toRaw(topMenuKey.value))
  })
}

/** Toggle menu position 切换菜单位置 */
const toggleMenuPosition = () => {
  refreshTopMenu()
  app.toggleMenuPosition()
}

/** show theme drawer 显示主题设置抽屉 */
const toggleThemeDrawer = () => {
  emit('action', 'toggleThemeDrawer')
}

/** toggle language 切换语言 */
const toggleLanguage = (lang: string) => {
  router.push({
    path: `/${lang.toLowerCase()}${route.path.replace(new RegExp(`^/${route.params.lang}/`, 'gi'), '/')}`,
    query: route.query,
    hash: route.hash,
  })
}

const onTopMenuKeyChange = (key: string) => {
  topMenuKey.value = key
  emit('keyChange', key)
}

const profileOptions = computed(() => [
  {
    key: 'header',
    type: 'header',
    meta: {
      name: t('author'),
      intro: t('intro'),
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG',
    },
  },
  { key: 'profile', icon: 'i-carbon:user-avatar-filled-alt', label: t('profileMenu.profile'), divided: true },
  { key: 'settings', icon: 'i-carbon:settings', label: t('profileMenu.settings') },
  { key: 'logout', icon: 'i-carbon:logout', label: t('profileMenu.logout'), divided: true },
])

const profileSelect = (info: any) => {
  switch (info.key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      router.push('/login')
      break
  }
}

onMounted(() => {
  topMenuKey.value = (menuSetting.value.topMenu.showSubMenu ? route.matched[1].name : route.name) as string
  console.log('topMenuKey.value', topMenuKey.value)
})

const langs = computed(() => availableLocales.map(locale => ({ label: locale, key: locale })))

const visible = computed(() => {
  return {
    leftSection: app.isMobile || (!app.IsTopBar && showMainMenuStatusButton),
    logo: app.IsTopBar && (!menuSetting.value.topMenu.showSubMenu || fullRoutes.filter(r => r.meta.parentName === topMenuKey.value).length === 0),
    menu: !app.isMobile && app.IsTopBar,
  }
})

/** Exposes 公开对象 */
defineExpose({ refreshTopMenu })
</script>

<template>
  <!-- Left section of the top bar 头部左侧区 -->
  <lay-header
    bordered
    :style="{ background: app.IsDarkMode ? '' : '#fff', padding: 0, height: 'auto', lineHeight: 'auto', borderBottom: `1px solid var(--el-border-color)` }"
  >
    <div h-header flex-right-center gap-x-4>
      <!-- Left section of the top bar 头部左侧区 -->
      <div v-if="visible.leftSection" h-full flex flex-1 items-center gap-x-4 p-l-4>
        <div :class="menuStateIcon" cursor-pointer text-5 @click="toggleMainMenu" />
        <span v-if="!app.isMobile" font-size-3 text-gray>←{{ t(MENU_STATE_TEXT[menuSetting.menuState!]) }}</span>
      </div>
      <!-- Top logo 顶栏Logo -->
      <Logo v-if="visible.logo" flex-nowrap px-28px style="border-right: 1px solid var(--el-border-color);" />
      <!-- Top menu 顶栏菜单 -->
      <div flex-1>
        <el-menu
          v-if="visible.menu" mode="horizontal" class="top-menu b-b-none!" :default-active="topMenuKey"
          @select="onTopMenuKeyChange"
        >
          <template #default>
            <component :is="menuItem" v-for="menuItem in topMenuItems" :key="menuItem.key" />
          </template>
        </el-menu>
      </div>
      <!-- Right section of the top bar 头部右侧区 -->
      <div h-full flex-right-center p-r-3>
        <ActionIcon
          v-if="menuSetting.topMenu.showSubMenu && app.IsTopBar && !app.isMobile" button
          icon-class="i-carbon:side-panel-close" @click="toggleMenuPosition"
        />
        <ActionIcon
          v-else-if="!app.isMobile" button
          :icon-class="`i-carbon:align-${app.IsTopBar ? 'horizontal-left' : 'vertical-top'}`"
          @click="toggleMenuPosition"
        />
        <ActionIcon
          v-if="menuSetting.buttons.includes(MenuButtonEnum.ThemeMode)" button
          icon-class="dark:i-line-md:sunny-filled i-line-md:moon-filled" hover-class-dark="text-yellow!"
          @click="app.toggleThemeMode"
        />
        <el-dropdown
          v-if="app.LocaleSetting.showButton && langs.length > 2" trigger="click"
          @command="(command) => toggleLanguage(command as string)"
        >
          <div flex-y-center>
            <ActionIcon button icon-class="i-carbon:language" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lang in langs" :key="lang.key" :command="lang.key">
                {{ lang.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <ActionIcon
          v-if="app.LocaleSetting.showButton && langs.length === 2" button icon-class="i-carbon:language"
          @click="toggleLanguage"
        />
        <ActionIcon
          v-if="!app.isMobile && app.hasMenuButton(MenuButtonEnum.ThemeDrawer)" button
          icon-class="i-carbon:cookie" @click="toggleThemeDrawer"
        />
        <!-- profile 个人资料 -->
        <el-dropdown trigger="click" @command="profileSelect">
          <ActionIcon button icon-class="i-carbon:user-avatar text-6" :text="t('author')" />
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="item in profileOptions" :key="item.key">
                <!-- <el-menu-divider v-if="item.type === 'divider'" :key="item.key" /> -->
                <el-dropdown-item v-if="item.type !== 'divider'" :key="item.key" :divided="item.divided">
                  <template v-if="item.type === 'header'">
                    <div mt-2 flex gap-2>
                      <el-avatar :src="item.meta?.avatar" :size="40" mt-1 />
                      <div w-160px>
                        <div>
                          {{ item.meta?.name }}
                        </div>
                        <div whitespace-break-spaces text-12px text-gray5>
                          {{ item.meta?.intro }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    {{ item.label }}
                  </template>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </lay-header>
</template>

<style scoped lang="scss">
:deep(.top-menu.el-menu) {
  --uno: 'h-header';

  .el-menu-item {
    --uno: 'h-header lh-header';
  }
}
</style>
