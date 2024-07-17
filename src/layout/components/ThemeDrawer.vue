<script setup lang="ts" name="Layout-ThemeDrawer">
import { useAppStore } from '@/store/modules/app'
import { ThemeModeEnum } from '@/shared'

const { t } = useI18n()
const app = useAppStore()

const icons: Record<ThemeModeEnum, string> = {
  [ThemeModeEnum.LIGHT]: 'i-line-md:sunny-filled',
  [ThemeModeEnum.DARK]: 'i-line-md:moon-filled',
  [ThemeModeEnum.SYSTEM]: 'i-carbon:contrast',
}

const texts: Record<ThemeModeEnum, string> = {
  [ThemeModeEnum.LIGHT]: 'theme.themeMode.light',
  [ThemeModeEnum.DARK]: 'theme.themeMode.dark',
  [ThemeModeEnum.SYSTEM]: 'theme.themeMode.system',
}

const themeModeRaw = computed({
  get: () => app.ThemeModeRaw,
  set: val => app.setThemeMode(val),
})

/** Main column reverse color 主栏反转颜色 */
const mainMenuInverted = computed({
  get: () => app.MenuSetting.mainMenu.inverted,
  set: val => app.setMenuSetting({ mainMenu: { inverted: val } }),
})

const drawerActive = ref(false)
const show = () => drawerActive.value = true

/** Exposes 公开对象 */
defineExpose({ show })
</script>

<template>
  <lay-layer
    v-if="!app.isMobile" v-model="drawerActive" :type="4" offset="r" :close-btn="false"
    :title="t('theme.themeDrawerTitle')" area="325px"
  >
    <div my-7>
      <lay-line content-position="left" border-style="dashed">
        {{ t('theme.themeMode.title') }}
      </lay-line>
    </div>
    <div class="flex-col-stretch gap-16px pl-6">
      <div class="i-flex-center">
        <lay-radio-group v-model="themeModeRaw" name="action">
          <template v-for="(_, key) in icons" :key="key">
            <lay-radio-button :value="key" size="sm">
              {{ t(texts[key]) }}
            </lay-radio-button>
          </template>
        </lay-radio-group>
      </div>
      <div v-if="app.ThemeModeRaw !== ThemeModeEnum.DARK" m-y-12px flex-y-center gap-8px>
        <span>深色侧边栏</span>
        <lay-switch v-model="mainMenuInverted" />
      </div>
    </div>
  </lay-layer>
</template>
