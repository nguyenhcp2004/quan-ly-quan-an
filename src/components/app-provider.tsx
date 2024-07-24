'use client'
import RefreshToken from '@/components/refresh-token'
import { removeTokensFromLocalStorage } from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isAuth, setIsAuthState] = useState(false)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      setIsAuthState(true)
    }
  }, [])

  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      removeTokensFromLocalStorage()
      setIsAuthState(false)
    }
  }, [])
  return (
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
