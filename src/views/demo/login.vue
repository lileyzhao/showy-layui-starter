<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import ActionIcon from '@/layout/components/ActionIcon.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const app = useAppStore()

const model = ref({ account: 'admin', password: 'admin' })

/** toggle language 切换语言 */
const toggleLanguage = () => {
  const lang = app.LocaleSetting.locale === 'zh_CN' ? 'en_US' : 'zh_CN'

  router.push({
    path: `/${lang.toLowerCase()}${route.path.replace(new RegExp(`^/${route.params.lang}/`, 'gi'), '/')}`,
    query: route.query,
    hash: route.hash,
  })
}

const onLogin = () => router.push('/')
</script>

<template>
  <div mx-auto mt-30 w-380px>
    <lay-field :title="t('login.title')">
      <lay-form :model="model" panel label-position="left">
        <lay-form-item prop="account" label="账号">
          <lay-input v-model="model.account" placeholder="请输入账号" @keydown.enter.prevent />
        </lay-form-item>
        <lay-form-item prop="password" label="密码">
          <lay-input v-model="model.password" type="password" placeholder="请输入密码" @keydown.enter.prevent />
        </lay-form-item>
        <div flex items-center justify-between>
          <div flex-right-center gap-x-5>
            <ActionIcon
              :icon-class="`i-line-md:${app.IsDarkMode ? 'sunny-filled' : 'moon-filled'}`"
              hover-class-dark="text-yellow" hover-class-light="text-purple" @click="app.toggleThemeMode"
            />
            <ActionIcon v-if="app.LocaleSetting.showButton" i-carbon-language @click="toggleLanguage" />
          </div>
          <lay-button type="primary" style="width: 120px" danger @click="onLogin">
            登 录
          </lay-button>
        </div>
      </lay-form>
    </lay-field>
  </div>
</template>
