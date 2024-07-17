'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu', // authRequired = Undefined nghĩ là đăng nhập hay chưa đề cho hiển thị
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true,
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false, //Khi false nghĩa là chưa đăng nhập thì sẽ hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true, // true nghĩa là đăng nhập rồi mới hiển thị
  },
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  }, [])
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
