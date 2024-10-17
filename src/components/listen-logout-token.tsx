import { useAppStore } from '@/components/app-provider'
import { usePathname, useRouter } from '@/i18n/routing'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'

import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/register', '/refresh-token']
export default function ListenLogoutToken() {
  const pathName = usePathname()
  const router = useRouter()
  const { isPending, mutateAsync } = useLogoutMutation()
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const setRole = useAppStore((state) => state.setRole)
  const socket = useAppStore((state) => state.socket)
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return
    const onLogout = async () => {
      if (isPending) return
      try {
        await mutateAsync()
        setRole()
        disconnectSocket()
        router.push('/')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }

    socket?.on('logout', onLogout)

    return () => {
      socket?.off('logout', onLogout)
    }
  }, [
    pathName,
    router,
    socket,
    disconnectSocket,
    isPending,
    mutateAsync,
    setRole
  ])

  return null
}
