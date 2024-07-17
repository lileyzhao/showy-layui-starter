import en_US from '../../locales/en-US.yml'
import zh_CN from '../../locales/zh-CN.yml'

export const locales = { en_US, zh_CN } as Record<string, object>

/** dynamic loaded locales 动态加载区域/语言 */
// export const locales = Object.fromEntries(
//   // Import i18n resources. 导入 i18n 资源。
//   // https://vitejs.dev/guide/features.html#glob-import
//   Object.entries(import.meta.glob('../../locales/*.yml', { import: 'default', eager: true })).map(([path, loadLocale]) => [
//     path.match(/([\w-]*)\.yml$/)?.[1].replace('-', '_'),
//     loadLocale,
//   ]),
// ) as Record<string, object>

/** Available locales 可用的区域/语言 */
export const availableLocales = Object.keys(locales)
