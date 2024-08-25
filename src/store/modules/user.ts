import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken
} from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { login as loginApi, refreshToken as refreshTokenApi, logout as logoutApi, getUserInfo } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import routeSettings from "@/config/route"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async (loginRequestData: LoginRequestData) => {
    const data = await loginApi(loginRequestData)
    setToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    token.value = data.accessToken
    // 每隔 50 分钟刷新一次 access token
    setInterval(
      () => {
        refreshTokenApi(data.refreshToken).then((newToken) => {
          setToken(newToken)
        })
      },
      50 * 60 * 1000
    )
  }
  /** 获取用户详情 */
  const getInfo = async () => {
    const data = await getUserInfo()
    username.value = data.username
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    roles.value = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles
  }
  /** 模拟角色变化 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // 用刷新页面代替重新登录
    window.location.reload()
  }
  /** 登出 */
  const logout = () => {
    logoutApi(getRefreshToken())
    removeToken()
    removeRefreshToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    removeRefreshToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return {
    token,
    roles,
    username,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
