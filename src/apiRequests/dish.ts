import http from '@/lib/http'
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'

const dishApiRequests = {
  // Nextjs 15 thì mặc đinh sẽ là: { cache: 'no-store' } (dynamic rendering)
  // Nextjs 14 mặc đinh fetch là { cache: 'force-cache' } nghĩa là cache (static rendering)
  list: () => http.get<DishListResType>('/dishes'),
  add: (body: CreateDishBodyType) => http.post<DishResType>('/dishes', body),
  getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`)
}

export default dishApiRequests
