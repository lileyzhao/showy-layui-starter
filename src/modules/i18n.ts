import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

// Create an i18n instance. 创建一个 i18n 实例。
export const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
  fallbackWarn: false,
  missingWarn: false,
})

const localesMap = Object.fromEntries(
  // Import i18n resources. 导入 i18n 资源。
  // https://vitejs.dev/guide/features.html#glob-import
  Object.entries(import.meta.glob('../../locales/*.yml')).map(([path, loadLocale]) => [
    path.match(/([\w-]*)\.yml$/)?.[1],
    loadLocale,
  ]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

/** Available locales 可用的区域/语言 */
export const availableLocales = Object.keys(localesMap)

/** Loaded languages 已加载的语言 */
const loadedLanguages: string[] = []

/**
 * Set the internationalization language.
 * 设置国际化语言
 * @param lang Language code (e.g., 'en-US', 'zh-CN') / 语言代码（例如 'en-US', 'zh-CN'）
 * @returns Returns the language code set / 返回设置的语言代码
 */
function setI18nLanguage(lang: string): Locale {
  // Set the global locale. 设置全局区域设置。
  i18n.global.locale.value = lang

  if (typeof document !== 'undefined')
    document.getElementById('htmlRoot')?.setAttribute('lang', lang)

  return lang
}

/**
 * Asynchronously load and set the application's language environment
 * 异步加载并设置应用的语言环境
 * @param lang Language code (e.g., 'en-US', 'zh-CN'). 语言代码（例如 'en-US', 'zh-CN'）。
 * @returns Returns the language code set or null if not found. 返回设置的语言代码，如果未找到则返回null。
 */
export async function setOrLoadLanguageAsync(lang: string): Promise<Locale | null> {
  // If the same language, set it directly and return
  // 如果是相同的语言，则直接设置并返回
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  // If the language was already loaded, set it directly and return
  // 如果语言已经加载，则直接设置并返回
  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  // If the language hasn't been loaded yet, asynchronously load the language's messages
  // 如果语言尚未加载，则异步加载该语言的消息
  if (localesMap[lang]) {
    const messages = await localesMap[lang]()
    i18n.global.setLocaleMessage(lang, messages.default)

    // Add the loaded language to the list of loaded languages
    // 将加载的语言添加到已加载语言列表中
    loadedLanguages.push(lang)

    // Set and return the newly loaded language
    // 设置并返回新加载的语言
    return setI18nLanguage(lang)
  }
  return null
}

/**
 * Setup i18n internationalization
 * 挂载i18n国际化
 * @param app Vue application instance. Vue 应用实例。
 */
export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

/**
 * Get ELement locale configuration based on the provided locale string
 * 根据提供的语言代码获取 ELement 的语言配置
 * @param locale Language code (e.g., 'zh-CN', 'zh-TW'). 语言代码（例如 'zh-CN', 'zh-TW'）。
 * @returns Returns the corresponding ALocale or null if not found. 返回相应的 ALocale，如果未找到则返回 null。
 */
export const getElementLocale = (locale: string | undefined | null): any | undefined => {
  if (locale === 'zh-CN')
    return zhCn
  if (locale === 'zh-TW')
    return zhTw
  return undefined // Default to English in Element. Element 默认情况下为英语。
}
