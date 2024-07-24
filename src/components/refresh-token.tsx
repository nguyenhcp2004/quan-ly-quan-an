import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/register', '/refresh-token', '/']
export default function RefreshToken() {
  const pathName = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return
    let interval: any = null
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        router.push('/login')
      }
    })
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    const TIMEOUT = 1000
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          router.push('/login')
        }
      })
    }, TIMEOUT)
    return () => clearInterval(interval)
  }, [pathName, router])

  return null
}
