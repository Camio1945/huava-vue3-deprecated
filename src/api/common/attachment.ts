// import { request } from "@/utils/service"

export interface Attachment {
  id: string
  // e.g. : /20240824/985d124c52a38fb1985d124c52a38fb1.jpg
  url: string
  originalName: string
  size: number
  humanSize: string
}
