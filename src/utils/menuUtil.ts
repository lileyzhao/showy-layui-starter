import { type RouteRecordNormalized, type RouteRecordRaw, RouterLink } from 'vue-router'
import { ElMenuItem, ElSubMenu } from 'element-plus'
import type { MenuSetting } from '@/shared'

/**
 * Map routes to menu items
 * 将路由映射为菜单项
 *
 * @param route The route object 路由对象
 * @param fullRoutes All routes 所有路由
 * @param t Internationalization function 国际化函数
 * @param loadChild Whether to load child menus 是否加载子菜单
 * @returns Mapped menu option 映射的菜单项
 */
export function mapRoutesToElMenuItem(
  route: RouteRecordRaw,
  fullRoutes: RouteRecordNormalized[],
  t: (x: string) => string,
  loadChild: boolean = true,
) {
  const childRoutes = fullRoutes.filter(r => r.meta.parentName === route.name)
  if (childRoutes.length > 0) {
    if (loadChild) {
      return h(
        ElSubMenu,
        { index: route.name as string },
        {
          default: () => childRoutes.map(childRoute => mapRoutesToElMenuItem(childRoute, fullRoutes, t)),
          title: () => [
            h('i', { class: `el-icon ${route.meta?.icon}` }),
            h('span', { class: 'text' }, `${t((route.meta?.title || route.name || route.path) as string)}`),
          ],
        },
      )
    }
    else {
      return h(
        ElMenuItem,
        { index: route.name as string },
        {
          default: () => [
            h('i', { class: `el-icon ${route.meta?.icon}` }),
            h('span', { class: 'text' }, `${t((route.meta?.title || route.name || route.path) as string)}`),
          ],
        },
      )
    }
  }
  else {
    return h(
      ElMenuItem,
      { index: route.name as string },
      {
        default: () =>
          h(
            RouterLink,
            { to: { path: route.path }, class: 'flex-y-center' },
            {
              default: () => [
                h('i', { class: `el-icon ${route.meta?.icon}` }),
                h('span', { class: 'text' }, `${t((route.meta?.title || route.name || route.path) as string)}`),
              ],
            },
          ),
      },
    )
  }
}

/**
 * Map routes to main menu items
 * 将路由映射为菜单项（主菜单）
 *
 * @param route The route object 路由对象
 * @param fullRoutes All routes 所有路由
 * @param t Internationalization function 国际化函数
 * @param loadChild Whether to load child menus 是否加载子菜单
 * @param mainMenuSetting Main menu settings 主菜单配置
 * @returns Mapped main menu option 映射的主菜单项
 */
export function mapRoutesToElMenuItemMain(
  route: RouteRecordRaw,
  fullRoutes: RouteRecordNormalized[],
  t: (x: string) => string,
  loadChild: boolean = true,
  mainMenuSetting: MenuSetting['mainMenu'],
) {
  const childRoutes = fullRoutes.filter(r => r.meta.parentName === route.name)

  const getIconText = (route: RouteRecordRaw) => {
    if (mainMenuSetting.collapsed && mainMenuSetting.showLabel) {
      return [
        h('div', { class: 'flex flex-col w-full items-center m-y-3.5' }, [
          h('i', { class: `${route.meta?.icon} text-20px w-6 h-6` }),
          h(
            'span',
            { class: 'font-size-3.4 line-height-none mt-2 w-48px of-hidden whitespace-nowrap text-center' },
            `${t((route.meta?.title || route.name || route.path) as string)}`,
          ),
        ]),
      ]
    }

    if (mainMenuSetting.collapsed && !mainMenuSetting.showLabel) {
      return [h('i', { class: `aaa el-icon w-full! ${route.meta?.icon} text-22px! m-y-6.06` })]
    }

    return [
      h('i', { class: `el-icon ${mainMenuSetting.collapsed ? 'w-full!' : ''} ${route.meta?.icon}` }),
      h('span', null, `${t((route.meta?.title || route.name || route.path) as string)}`),
    ]
  }

  if (childRoutes.length > 0 && loadChild) {
    const menuSubChild = childRoutes.map(childRoute => mapRoutesToElMenuItem(childRoute, fullRoutes, t))
    return h(
      ElSubMenu,
      { index: route.name as string, class: mainMenuSetting.collapsed && mainMenuSetting.showLabel ? 'p-0! h-auto!' : '' },
      {
        default: () => menuSubChild,
        title: () => getIconText(route),
      },
    )
  }
  else {
    const vMenuItem = h(
      ElMenuItem,
      {
        index: route.name as string,
        class: mainMenuSetting.collapsed && mainMenuSetting.showLabel ? 'p-0! h-auto!' : 'h-auto!',
      },
      { default: () => getIconText(route) },
    )

    if (childRoutes.length === 0) {
      return h(RouterLink, { to: { path: route.path } }, { default: () => vMenuItem })
    }

    return vMenuItem
  }
}
