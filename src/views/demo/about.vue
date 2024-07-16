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
  <el-card content-class="!p-8px" class="m--8px! border-none!" shadow="never" :body-style="{ padding: 0 }">
    <el-space direction="vertical" :size="14" fill w-full>
      <el-card :header="t('page.about.title')" :bordered="false" size="small" segmented class="card-wrapper">
        <p>{{ t('page.about.introduction') }}</p>
      </el-card>
      <el-card
        :header="t('page.about.projectInfo.title')" :bordered="false" size="small" segmented
        class="card-wrapper"
      >
        <el-descriptions border size="small" :column="column">
          <el-descriptions-item :label="t('page.about.projectInfo.version')">
            <el-tag type="primary">
              {{ pkgJson.version }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('page.about.projectInfo.latestBuildTime')">
            <el-tag type="primary">
              {{ latestBuildTime }}
            </el-tag>
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
      </el-card>
      <el-card :header="t('page.about.prdDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <el-descriptions label-placement="left" border size="small" :column="column">
          <el-descriptions-item v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card :header="t('page.about.devDep')" :bordered="false" size="small" segmented class="card-wrapper">
        <el-descriptions label-placement="left" border size="small" :column="column">
          <el-descriptions-item v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
            {{ item.version }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-space>
  </el-card>
</template>

<style scoped></style>
