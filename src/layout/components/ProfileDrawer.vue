<script setup lang="ts" name="Layout-ProfileDrawer">
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
  <el-drawer v-model="drawerActive" force-render :width="325" :title="t('theme.themeDrawerTitle')" :closable="false">
    <el-divider content-position="left" border-style="dashed">
      {{ t('theme.themeMode.title') }}
    </el-divider>
    <div class="flex-col-stretch gap-16px">
      <div class="i-flex-center">
        <el-radio-group v-model="themeModeRaw">
          <template v-for="(_, key) in icons" :key="key">
            <el-radio-button :label="t(texts[key])" :value="key" />
          </template>
        </el-radio-group>
      </div>
      <div v-if="app.ThemeModeRaw !== ThemeModeEnum.DARK" m-y-12px flex-y-center gap-8px>
        <span>深色侧边栏</span>
        <el-switch v-model="mainMenuInverted" />
      </div>
    </div>
  </el-drawer>
</template>
