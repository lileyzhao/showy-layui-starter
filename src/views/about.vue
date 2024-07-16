<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import pkg from '@/../package.json'

const app = useAppStore()

const { t } = useI18n()

const column = computed(() => (app.isMobile ? 1 : 2))

interface PkgJson {
  name: string
  version: string
  website?: string
  dependencies: PkgVersionInfo[]
  devDependencies: PkgVersionInfo[]
}

interface PkgVersionInfo {
  name: string
  version: string
}

const { name, version, dependencies, devDependencies } = pkg

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple
  return {
    name: $name,
    version: $version,
  }
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item)),
}

const latestBuildTime = BUILD_TIME
</script>

<template>
  <lay-card class="border-none!" shadow="never">
    <lay-space direction="vertical" :size="14" fill w-full>
      <lay-card :title="t('page.about.title')">
        <p>{{ t('page.about.introduction') }}</p>
      </lay-card>
      <lay-card
        :header="t('page.about.projectInfo.title')" :bordered="false" size="small" segmented
        class="card-wrapper"
      >
        <el-descriptions border size="small" :column="column">
          <el-descriptions-item :label="t('page.about.projectInfo.version')">
            <lay-tag type="primary">
              {{ pkgJson.version }}
            </lay-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('page.about.projectInfo.latestBuildTime')">
            <lay-tag type="primary">
              {{ latestBuildTime }}
            </lay-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('page.about.projectInfo.githubLink')">
            <el-link :href="pkg.homepage" target="_blank" rel="noopener noreferrer" type="primary">
              {{ t('page.about.projectInfo.githubLink') }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item :label="t('page.about.projectInfo.previewLink')">
            <el-link :href="pkg.homepage" target="_blank" rel="noopener noreferrer" type="primary">
              {{ t('page.about.projectInfo.previewLink') }}
            </el-link>
          </el-descriptions-item>
        </el-descriptions>
      </lay-card>
      <lay-card :header="t('page.about.prdDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <el-descriptions lablay-placement="left" border size="small" :column="column">
          <el-descriptions-item v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </el-descriptions-item>
        </el-descriptions>
      </lay-card>
      <lay-card :header="t('page.about.devDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <el-descriptions lablay-placement="left" border size="small" :column="column">
          <el-descriptions-item v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </el-descriptions-item>
        </el-descriptions>
      </lay-card>
    </lay-space>
  </lay-card>
</template>

<style scoped></style>
