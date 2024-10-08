import { request } from "@/utils/service"

/** 增 */
export function create(data: CreateOrUpdateRoleRequestData) {
  return request({
    url: "sys/role/create",
    method: "post",
    data
  })
}

/** 删 */
export function del(id: string) {
  return request({
    url: `sys/role/delete`,
    method: "delete",
    data: { id }
  })
}

/** 改 */
export function update(data: CreateOrUpdateRoleRequestData) {
  return request({
    url: "sys/role/update",
    method: "put",
    data
  })
}

/** 查分页 */
export function page(params: RoleRequestData) {
  return request<RoleResData>({
    url: "sys/role/page",
    method: "get",
    params
  })
}

/** 查详情 */
export function detail(id: string) {
  return request<Role>({
    url: `sys/role/get/${id}`,
    method: "get"
  })
}

/** 名称是否已经存在 */
export function isNameExists(id: string, name: string) {
  return request<boolean>({
    url: `sys/role/isNameExists`,
    method: "get",
    params: { id, name }
  })
}

/** interfaces (data structure) */

interface CreateOrUpdateRoleRequestData {
  name: string
  description?: string
}

interface RoleRequestData {
  /** 当前页码 */
  current: number
  /** 查询条数 */
  size: number
  /** 查询参数：名称 */
  name?: string
  /** 查询参数：描述 */
  description?: string
}

export interface Role {
  id: string
  name: string
  description: string
  createTime: string
}

export type RoleResData = {
  list: Role[]
  total: number
}
