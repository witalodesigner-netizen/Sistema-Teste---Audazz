import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que precisam de autenticação (portal-token cookie)
const protectedRoutes = [
  '/',
  '/bi',
  '/brand-book',
  '/briefings',
  '/clients',
  '/configuracoes',
  '/finance',
  '/help',
  '/operacoes',
  '/productivity',
  '/projects',
  '/sales',
  '/settings',
  '/subscriptions',
]

// Rotas públicas (não precisam de auth)
const publicRoutes = ['/login', '/portal']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const portalToken = request.cookies.get('portal-token')?.value

  // Ignora rotas estáticas e de API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Rotas do portal de cliente (sempre públicas)
  if (pathname.startsWith('/portal')) {
    return NextResponse.next()
  }

  // Se está logado e tenta acessar /login → redireciona para dashboard
  if (pathname === '/login' && portalToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se não está logado e tenta acessar rota protegida → vai para login
  const isProtected = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  if (isProtected && !portalToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}
