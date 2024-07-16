<script setup lang="ts" name="Layout-ActionIcon">
const props = defineProps<{
  /** it is a button? 是否显示为按钮 */
  button?: boolean
  /**
   * Override the default class, when displayed as a button
   * 重写默认的class，显示为按钮时有效
   */
  class?: string
  /** text to display 显示文本 */
  text?: string
  /** class for the text 文本的类 */
  textClass?: string
  /** class for the icon 图标的类 */
  iconClass?: string
}>()

const defaultBtnClass = 'px-2.6! py-2.4! h-auto! ml-0! dark:text-white! text-black! hover:color-primary!'
const defaultIconClass = 'text-5 cursor-pointer'

/** Button class 按钮类 */
const buttonClass = computed(() => `${defaultBtnClass} ${props.class ?? ''}`)

/** Icon class 图标类 */
const iconClass = computed(() => `${defaultIconClass} ${props.class ?? ''} ${props.iconClass ?? ''}`)
</script>

<template>
  <el-button v-if="props.button" text checkable size="large" :class="buttonClass">
    <div flex-y-center flex-row gap-x-2>
      <div :class="iconClass" />
      <span v-if="text" :class="props.textClass">{{ props.text }}</span>
    </div>
  </el-button>
  <div v-else :class="iconClass" hover:color-primary />
</template>
