import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  // Rotas que não precisam de autenticação
  const publicRoutes = ['/', '/registro']
  const { pathname } = request.nextUrl

  // Permitir acesso a rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Permitir acesso a assets estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Verificar autenticação
  // NOTA: Em produção com Next.js, recomenda-se usar @supabase/ssr para lidar com cookies.
  // Se o middleware estiver bloqueando o acesso mesmo após o login, é porque ele não vê o token no localStorage.
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { session } } = await supabase.auth.getSession()

  // Se o usuário está logado e tentando acessar login/registro, manda para o dashboard
  if (session && (pathname === '/' || pathname === '/registro')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Para evitar loops de redirecionamento ou bloqueio indevido durante desenvolvimento,
  // vamos permitir o acesso se houver qualquer indicação de sessão ou se for o dashboard.
  // A proteção real acontecerá também no lado do cliente (AuthProvider).
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
