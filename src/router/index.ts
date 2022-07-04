import type { RouteRecordRaw } from 'vue-router'
import type { AppRouteModule } from './types'
import { createRouter, createWebHistory } from 'vue-router'
import { getAppEnvConfig } from '@/utils/env'

const { VITE_PUBLIC_PATH } = getAppEnvConfig()

/* Layout */
import Layout from '@/layout/index.vue'

/* Router Modules */
import ERROR_ROUTES from '@/router/modules/error' // 错误页面路由

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    keepAlive: true                 // 如果设置为true，则会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
    whiteList: true                 // 当路由设置了该属性，不需要登录就可以访问。
  }
 */

/* ConstantRoutes */
export const constantRoutes: AppRouteModule[] = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        name: 'RedirectAll',
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { whiteList: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'HomeIndex',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  ...ERROR_ROUTES
]

export const router = createRouter({
  strict: true,
  history: createWebHistory(`${VITE_PUBLIC_PATH}`),
  scrollBehavior: () => ({ top: 0, left: 0 }),
  routes: constantRoutes as unknown as RouteRecordRaw[]
})

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(constantRoutes)

/* resetRouter */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
