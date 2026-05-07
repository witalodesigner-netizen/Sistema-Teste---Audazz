import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url))
  
  // Remove o cookie de autenticao do portal
  response.cookies.set('portal-token', '', { 
    expires: new Date(0),
    path: '/'
  })
  
  return response
}
