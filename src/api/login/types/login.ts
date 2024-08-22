export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor";
  /** 密码 */
  password: string;
  /** 验证码 */
  captchaCode: string;
  isCaptchaDisabledForTesting: boolean;
}

export type LoginCodeResponseData = ApiResponseData<string>;

export type LoginResponseData = ApiResponseData<{
  accessToken: string;
  refreshToken: string;
}>;

export type UserInfoResponseData = ApiResponseData<{
  username: string;
  roles: string[];
}>;

export type UserMenuResponseData = IApiResponseData<{ menu: any[] }>;
