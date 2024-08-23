import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get, merge } from "lodash-es"
import { getRefreshToken, getToken, setToken } from "./cache/cookies"
import { refreshToken as refreshTokenApi } from "@/api/login"

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

const statusToMessageMap = {
  400: "请求错误",
  401: "请求未授权",
  403: "拒绝访问",
  404: "请求地址出错",
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP 版本不受支持"
}

/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 api 返回的数据
      const apiData = response.data
      // 二进制数据则直接返回
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") {
        return apiData
      }
      return apiData
    },
    async (error) => {
      console.error(error)
      // status 是 HTTP 状态码
      const status = get(error, "response.status")
      const message = error.response.data
      if (status === 401) {
        if (message === "Access token expired") {
          const accessToken = await refreshTokenApi(getRefreshToken())
          setToken(accessToken)
          ElMessage.warning("网络抖动，请重试")
          return Promise.reject(error)
        } else if (message === "Refresh token expired") {
          logout()
          ElMessage.error("请重新登录")
          return Promise.reject(error)
        }
      }
      if (message && typeof message === "string" && message.trim().length > 0) {
        error.message = message
      } else {
        error.message = statusToMessageMap[status] || "未知错误"
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        // 携带 Token
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** 用于网络请求的实例 */
const service = createService()
/** 用于网络请求的方法 */
export const request = createRequest(service)
