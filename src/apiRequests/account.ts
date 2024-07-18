import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

const accountApiRequests = {
  me: () => {
    return http.get<AccountResType>('/accounts/me')
  }
}

export default accountApiRequests
