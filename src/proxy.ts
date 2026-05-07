import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que exigem autenticação do Portal (Firebase)
const portalProtectedRoutes = ['/dashboard', '/portal', '/settings']
// Rotas de autenticação (redirecionam se já estiver logado no portal)
const authRoutes = ['/login']

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl
  const { userId } = await auth()
  
  // 1. Lógica do Portal Audazz (Firebase/CPF)
  const portalToken = request.cookies.get('portal-token')?.value

  // Se for uma rota protegida e não tiver nenhum dos dois tokens
  if (portalProtectedRoutes.some(route => pathname.startsWith(route))) {
    if (!portalToken && !userId) {
      // Se não estiver logado nem no portal nem como admin, redireciona para login
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Se for a raiz '/', redireciona para dashboard se tiver algum token, senão login
  if (pathname === '/') {
    if (portalToken || userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se estiver logado em qualquer um e tentar acessar a tela de login
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (portalToken || userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 2. Lógica do Clerk (Admin)
  // O clerkMiddleware já trata a autenticação se configurado, 
  // mas aqui deixamos o fluxo seguir para os handlers normais.
  return NextResponse.next()
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
