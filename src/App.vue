<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useCssVar } from '@vueuse/core'

const themeVars = reactive({
  colorPrimary: '#646CFF',
})

const primaryColor = useCssVar('--el-color-primary', null, { initialValue: themeVars.colorPrimary })
primaryColor.value = themeVars.colorPrimary

/** Element global config */
const globalConfig = reactive({
  size: 'default' as 'default' | 'small' | 'large',
  zIndex: 3000,
  locale: zhCn,
  buttonConfig: { autoInsertSpace: false },
  messageConfig: { max: 3 },
})
</script>

<template>
  <el-config-provider
    :size="globalConfig.size" :z-index="globalConfig.zIndex" :locale="globalConfig.locale"
    :button="globalConfig.buttonConfig" :message="globalConfig.messageConfig"
  >
    <router-view />
  </el-config-provider>
</template>
