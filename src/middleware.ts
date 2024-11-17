import { Role } from '@/constants/type'
import { TokenPayload } from '@/types/jwt.types'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config'

const managePaths = ['/vi/manage', '/en/manage']
const guestPaths = ['/vi/guest', '/en/guest']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/vi/login', '/en/login']
const loginPaths = ['/vi/login', '/en/login']

const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  })

  const response = handleI18nRouting(request)
  const { pathname, searchParams } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  //1. Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(`/${locale}/login`, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
    // response.headers.set('x-middleware-rewrite', url.toString())
    // return response
  }

  //2 Trường hợp đã đăng nhập
  if (refreshToken) {
    //2.1 Nếu cố tình vào trang login thì sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      if (
        loginPaths.some((path) => pathname.startsWith(path)) &&
        searchParams.get('accessToken')
      ) {
        return response
      }
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set(
      //   'x-middleware-rewrite',
      //   new URL('/', request.url).toString()
      // )

      // return response
    }

    //2.2 Nhưng accessToken lại hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL(`/${locale}/refresh-token`, request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
      // response.headers.set('x-middleware-rewrite', url.toString())
      // return response
    }

    //2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role
    // Guest nhưng cố vào role Owner
    const isGuestGoToManagePaths =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path))
    // Không phải guest nhưng cố vào route Guest
    const isNotGuestGoToGuestPaths =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path))
    const isNotOwnerGoToOwnerPaths =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path))
    if (
      isGuestGoToManagePaths ||
      isNotGuestGoToGuestPaths ||
      isNotOwnerGoToOwnerPaths
    ) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set(
      //   'x-middleware-rewrite',
      //   new URL('/', request.url).toString()
      // )

      // return response
    }

    return response
  }

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/(vi|en)/:path*']
}
