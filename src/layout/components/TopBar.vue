<script setup lang="ts" name="Layout-TopBar">
import Logo from '@/layout/components/Logo.vue'
import { useAppStore } from '@/store'
import { MENU_STATE_TEXT, MenuButtonEnum } from '@/shared'
import ActionIcon from '@/layout/components/ActionIcon.vue'
import { mapRoutesToLayMenuItem } from '@/utils/menuUtil'
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
  return routers.map(route => mapRoutesToLayMenuItem(route, fullRoutes, t, !menuSetting.value.topMenu.showSubMenu))
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
  if (typeof lang !== 'string')
    lang = app.LocaleSetting.locale === 'zh_CN' ? 'en_US' : 'zh_CN'

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
  { key: 'profile-line', type: 'divider' },
  { key: 'profile', icon: 'i-carbon:user-avatar-filled-alt', label: t('profileMenu.profile'), divided: true },
  { key: 'settings', icon: 'i-carbon:settings', label: t('profileMenu.settings') },
  { key: 'logout-line', type: 'divider' },
  { key: 'logout', icon: 'i-carbon:logout', label: t('profileMenu.logout'), divided: true },
])

const profileSelect = (info: any) => {
  console.log('profileSelect', info)
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
        <lay-menu
          v-if="visible.menu" v-model:selectedKey="topMenuKey" class="top-menu w-full!" theme="light"
          @change-selected-key="onTopMenuKeyChange"
        >
          <template #default>
            <component :is="menuItem" v-for="menuItem in topMenuItems" :key="menuItem.key" />
          </template>
        </lay-menu>
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
        <lay-dropdown v-if="app.LocaleSetting.showButton && langs.length > 1" update-at-scroll>
          <lay-button>
            <ActionIcon button icon-class="i-carbon:language" />
          </lay-button>
          <template #content>
            <lay-dropdown-menu>
              <lay-dropdown-menu-item v-for="lang in langs" :key="lang.key">
                {{ lang.label }}
              </lay-dropdown-menu-item>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
        <ActionIcon
          v-if="app.LocaleSetting.showButton && langs.length === 2" button icon-class="i-carbon:language"
          @click="toggleLanguage"
        />
        <ActionIcon
          v-if="!app.isMobile && app.hasMenuButton(MenuButtonEnum.ThemeDrawer)" button
          icon-class="i-carbon:cookie" @click="toggleThemeDrawer"
        />
        <!-- profile 个人资料 -->
        <lay-dropdown>
          <ActionIcon button icon-class="i-carbon:user-avatar text-6" :text="t('author')" />
          <template #content>
            <lay-dropdown-menu>
              <template v-for="item in profileOptions" :key="item.key">
                <lay-dropdown-menu-item v-if="item.type !== 'divider'" :key="item.key" :divided="item.divided">
                  <template v-if="item.type === 'header'">
                    <div mt-2 flex gap-2>
                      <lay-avatar :src="item.meta?.avatar" radius size="lg" mt-1 />
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
                </lay-dropdown-menu-item>
                <lay-line v-else />
              </template>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
      </div>
    </div>
  </lay-header>
</template>

<style scoped lang="scss">
:deep(.top-menu.layui-nav) {
  .layui-nav-item {
    --uno: 'h-header lh-header';

    > a {
      --uno: 'pl-6! pr-8!';
      display: flex;

      span {
        display: flex;
        align-items: center;

        a {
          display: flex;
          align-items: center;
        }

        span {
          display: inline-block;
          padding-left: 11.5px;
        }
      }
    }
  }
}
</style>
