import accountApiRequests from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequests.me
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequests.updateMe
  })
}
