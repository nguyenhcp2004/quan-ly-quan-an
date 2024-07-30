import dishApiRequests from '@/apiRequests/dish'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useDishListQuery = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishApiRequests.list
  })
}

export const useGetDishQuery = ({
  id,
  enabled
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequests.getDish(id),
    enabled
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequests.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
    }
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => {
      return dishApiRequests.updateDish(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'], exact: true })
    }
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequests.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}
