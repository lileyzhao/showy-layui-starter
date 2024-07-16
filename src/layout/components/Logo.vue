<script setup lang="ts" name="Layout-Logo">
import { useCssVar } from '@vueuse/core'

const props = defineProps({ hideLogo: Boolean, hideTitle: Boolean })

const { t } = useI18n()

const primaryColor = ref<string>()

nextTick(() => {
  primaryColor.value = useCssVar('--el-color-primary').value
})

const mainClass = computed(() => !props.hideTitle ? 'pl-4' : 'flex-x-center')
const titleClass = computed(() => !props.hideLogo ? 'p-l-2.5' : '')
</script>

<template>
  <div h-header of-hidden :class="mainClass">
    <div h-full flex :style="`color:${primaryColor}`">
      <div v-if="!props.hideLogo" type="text" h-full inline-flex-center>
        <span i-carbon:wind-gusts font-size-8 />
      </div>
      <div v-if="!props.hideTitle" type="text" :class="titleClass" h-full inline-flex-center>
        <span pt-1 text-nowrap font-size-4 font-bold>{{ t('team') }}</span>
      </div>
    </div>
  </div>
</template>
