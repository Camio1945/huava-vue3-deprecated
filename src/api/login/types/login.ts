export interface LoginRequestData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  captchaCode: string
  isCaptchaDisabledForTesting: boolean
}

export type LoginResData = {
  accessToken: string
  refreshToken: string
}

export type UserInfoResData = {
  username: string
  roles: string[]
}

// export type UserMenuResData = IApiResData<{ menu: any[] }>;
