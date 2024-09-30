'use client'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDishListQuery } from '@/queries/useDish'
import { Button } from '@/components/ui/button'
import Quantity from '@/app/guest/menu/quantity'
import { useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { DishStatus } from '@/constants/type'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'

export default function MenuOrder() {
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { mutateAsync } = useGuestOrderMutation()
  const router = useRouter()

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + dish.price * order.quantity
    }, 0)
  }, [dishes, orders])

  const handleOrder = async () => {
    try {
      await mutateAsync(orders)
      router.push('/guest/orders')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn('flex gap-4', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
          >
            <div className='flex-shrink-0 relative'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex items-center justify-center text-sm'>
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                priority={true}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                value={
                  orders.find((order) => order.dishId === dish.id)?.quantity ??
                  0
                }
                onChange={(value) => handleQuantityChange(dish.id, value)}
              />
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button
          className='w-full justify-between'
          disabled={orders.length === 0}
          onClick={handleOrder}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}