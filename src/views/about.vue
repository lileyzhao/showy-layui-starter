<script setup lang="ts">
import pkg from '@/../package.json'

const { t } = useI18n()

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
      <lay-field :title="t('page.about.title')">
        <p>{{ t('page.about.introduction') }}</p>
      </lay-field>
      <lay-card :title="t('page.about.projectInfo.title')">
        <div class="descriptions">
          <div class="description-item">
            <label>{{ t('page.about.projectInfo.version') }}</label>
            <span color-primary>{{ pkgJson.version }}</span>
          </div>
          <div class="description-item">
            <label>{{ t('page.about.projectInfo.latestBuildTime') }}</label>
            <span color-primary>{{ latestBuildTime }}</span>
          </div>
          <div class="description-item">
            <label>{{ t('page.about.projectInfo.githubLink') }}</label>
            <a :href="pkg.homepage" target="_blank" rel="noopener noreferrer" color-primary>
              {{ t('page.about.projectInfo.githubLink') }}
            </a>
          </div>
          <div class="description-item">
            <label>{{ t('page.about.projectInfo.previewLink') }}</label>
            <a :href="pkg.homepage" target="_blank" rel="noopener noreferrer" color-primary>
              {{ t('page.about.projectInfo.previewLink') }}
            </a>
          </div>
        </div>
      </lay-card>
      <lay-card :title="t('page.about.prdDep')">
        <div class="descriptions">
          <div v-for="item in pkgJson.dependencies" :key="item.name" class="description-item">
            <label>{{ item.name }}</label>
            <span>{{ item.version }}</span>
          </div>
        </div>
      </lay-card>
      <lay-card :title="t('page.about.devDep')">
        <div class="descriptions">
          <div v-for="item in pkgJson.devDependencies" :key="item.name" class="description-item">
            <label>{{ item.name }}</label>
            <span>{{ item.version }}</span>
          </div>
        </div>
      </lay-card>
    </lay-space>
  </lay-card>
</template>

<style scoped lang="scss">
.descriptions {
  --uno: 'flex flex-wrap';

  .description-item {
    --uno: 'w-50% h-13 lh-13 flex';

    label {
      --uno: 'block w-30% bg-white! pl-2 flex-1 font-bold';
      background-color: red;
    }

    a,
    span {
      --uno: 'flex-1';
    }
  }

  @media (max-width: 640px) {
    .description-item {
      --uno: 'w-100%';
    }
  }
}
</style>
