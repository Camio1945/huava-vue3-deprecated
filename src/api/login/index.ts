import { request } from "@/utils/service";
import type * as Login from "./types/login";

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "sys/user/code",
    method: "get",
  });
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "sys/user/login",
    method: "post",
    data,
  });
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "sys/user/info",
    method: "get",
  });
}

/** 获取用户菜单 */
export function getUserMenuApi() {
  return request<Login.UserMenuResponseData>({
    url: "users/menu",
    method: "get",
  });
}
