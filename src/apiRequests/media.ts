import http from '@/lib/http'
import { UploadImageResType } from '@/schemaValidations/media.schema'

export const mediaApiRequests = {
  upload: (formdata: FormData) =>
    http.put<UploadImageResType>('/media/upload', formdata)
}
