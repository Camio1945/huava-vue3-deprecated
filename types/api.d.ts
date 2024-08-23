/** 所有 api 接口的响应数据都应遵守该格式 */
interface ApiResData<T> {
  code: number
  data: T
  message: string
}
