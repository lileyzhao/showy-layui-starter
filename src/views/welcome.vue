<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const app = useAppStore()
const route = useRoute()

const currentTime = ref('00:00:00')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  // message.success(app.IsDarkMode ? t('welcome.night') : t('welcome.morning'))
})
</script>

<template>
  <el-card class="m--12px! b-0! b-rd-0!" shadow="never" :body-style="{ padding: 0 }">
    <div flex flex-col items-center justify-center gap-y-4 pt-4>
      <div
        :class="`i-line-md:${app.IsDarkMode ? 'moon-filled-loop text-purple' : 'sunny-filled-loop text-yellow'}`"
        text-24
      />
      <div class="time-display">
        {{ currentTime }}
      </div>
      <div text-6>
        {{ app.IsDarkMode ? t('welcome.night') : t('welcome.morning') }}
      </div>
      <div decoration-underline>
        {{ route?.path }}
      </div>
      <el-space>
        <el-date-picker type="date" w-48 />
        <el-time-picker w-48 />
      </el-space>
    </div>
    <div class="m-4 text-center">
      <el-button>Default</el-button>
      <el-button type="primary">
        Primary
      </el-button>
      <el-button type="success">
        Success
      </el-button>
      <el-button type="info">
        Info
      </el-button>
      <el-button type="warning">
        Warning
      </el-button>
      <el-button type="danger">
        Danger
      </el-button>
    </div>
    <div class="h-380vh flex flex-col items-center justify-end pb-4 text-4">
      ... {{ t('intro') }} ...
    </div>
  </el-card>
</template>

<style scoped lang="scss">
@import '../assets/styles/_fonts.scss';

.time-display {
  font-family: 'DSEG7ModernMini', sans-serif;
  font-size: 2rem;
  font-weight: bold;
}
</style>
