import { request } from "@/utils/service"

/** 增 */
export function create(data: CreateOrUpdateUserRequestData) {
  return request({
    url: "sys/user/create",
    method: "post",
    data
  })
}

/** 删 */
export function del(id: string) {
  return request({
    url: `sys/user/delete`,
    method: "delete",
    data: { id }
  })
}

/** 改 */
export function update(data: CreateOrUpdateUserRequestData) {
  return request({
    url: "sys/user/update",
    method: "put",
    data
  })
}

/** 改密码 */
export function updatePassword(data: UpdatePasswordData) {
  return request({
    url: "sys/user/updatePassword",
    method: "patch",
    data
  })
}

/** 查分页 */
export function page(params: UserRequestData) {
  return request<UserResData>({
    url: "sys/user/page",
    method: "get",
    params
  })
}

/** 查详情 */
export function detail(id: string) {
  return request<User>({
    url: `sys/user/get/${id}`,
    method: "get"
  })
}

/** 用户名是否已经存在 */
export function isUsernameExists(id: string, username: string) {
  return request<boolean>({
    url: `sys/user/isUsernameExists`,
    method: "get",
    params: { id, username }
  })
}

/** interfaces (data structure) */

export interface CreateOrUpdateUserRequestData {
  id: string
  username: string
  password: string
  realName: string
  phoneNumber: string
  gender: string
  isEnabled: boolean
  disabledReason: string
  roleIds: string[]
  avatar: string
}

export interface UpdatePasswordData {
  oldPassword: string
  newPassword: string
}

export interface UserRequestData {
  /** 当前页码 */
  current: number
  /** 查询条数 */
  size: number
  /** 查询参数：名称 */
  name?: string
  /** 查询参数：描述 */
  description?: string
}

export interface User {
  id: string
  name: string
  description: string
  createTime: string
}

export type UserResData = {
  list: User[]
  total: number
}
