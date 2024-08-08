import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import queryString from 'query-string'

const prefix = '/accounts'
const accountApiRequests = {
  me: () => http.get<AccountResType>(`${prefix}/me`),

  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),

  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, body),
  list: () => http.get<AccountListResType>(`${prefix}`),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(prefix, body),

  getEmployee: (id: number) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),

  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),

  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
  guestList: (queryParams: GetGuestListQueryParamsType) =>
    http.get<GetListGuestsResType>(
      `/guests?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    ),
  createGuest: (body: CreateGuestBodyType) =>
    http.post<CreateGuestBodyType>('/guests', body)
}

export default accountApiRequests
