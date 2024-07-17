<script setup lang="ts">
import { locales } from './utils/i18nUtil'
import { useAppStore } from '@/store/modules/app'

const app = useAppStore()

const languages = Object.keys(locales).map(key => ({ name: key, locale: locales[key], merge: true }))

const theme = computed(() => app.ThemeMode)

const themeVariable = reactive({
  '--global-primary-color': '#646CFF',
  // "--global-checked-color":"red"
})

nextTick(() => {
  // app.initAppConfig()
})
</script>

<template>
  <lay-config-provider :locales="languages" :locale="app.LocaleSetting.locale" :theme="theme" :theme-variable="themeVariable">
    <router-view />
  </lay-config-provider>
</template>
