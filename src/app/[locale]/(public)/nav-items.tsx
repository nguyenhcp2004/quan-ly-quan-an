'use client'

import { useAppStore } from '@/components/app-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { Link } from '@/i18n/routing'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useGuestLogoutMutation } from '@/queries/useGuest'
import { RoleType } from '@/types/jwt.types'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
  {
    title: 'home',
    href: '/'
  },
  {
    title: 'menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'orders',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'login',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'manage',
    href: '/manage/dashboard',
    role: [Role.Employee, Role.Owner]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItem')
  const { role, setRole, disconnectSocket } = useAppStore()
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const guestLogoutMutation = useGuestLogoutMutation()
  const logout = async () => {
    if (logoutMutation.isPending || guestLogoutMutation.isPending) return
    try {
      role === Role.Guest
        ? await guestLogoutMutation.mutateAsync()
        : await logoutMutation.mutateAsync()
      setRole()
      disconnectSocket()
      router.push('/')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role)
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          )
        }
        return null
      })}
      {role && role === Role.Guest && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>{t('logout')}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {' '}
                {t('logoutDialog.logoutQuestion')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('logoutDialog.logoutConfirm')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {' '}
                {t('logoutDialog.logoutCancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {role && role !== Role.Guest && (
        <div className={cn(className, 'cursor-pointer')} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
