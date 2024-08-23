import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCode() {
  return request<string>({
    url: "sys/user/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function login(data: Login.LoginRequestData) {
  return request<Login.LoginResData>({
    url: "sys/user/login",
    method: "post",
    data
  })
}

/** 通过 refreshToken 获取新的 accessToken */
export function refreshToken(refreshToken: string) {
  return request<string>({
    url: "sys/user/refreshToken",
    method: "post",
    headers: { "Content-Type": "text/plain" },
    data: refreshToken
  })
}

/** 退出登录 */
export function logout(refreshToken: string) {
  return request<string>({
    url: "sys/user/logout",
    method: "post",
    headers: { "Content-Type": "text/plain" },
    data: refreshToken
  })
}

/** 获取用户详情 */
export function getUserInfo() {
  return request<Login.UserInfoResData>({
    url: "sys/user/info",
    method: "get"
  })
}

/** 获取用户菜单 */
// export function getUserMenuApi() {
//   return request<Login.UserMenuResData>({
//     url: "users/menu",
//     method: "get",
//   });
// }
