<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const app = useAppStore()

const theme = computed(() => app.ThemeMode)

const themeVariable = reactive({
  '--global-primary-color': '#646CFF',
  // "--global-checked-color":"red"
})
</script>

<template>
  <lay-config-provider :theme="theme" :theme-variable="themeVariable">
    <router-view />
  </lay-config-provider>
</template>
