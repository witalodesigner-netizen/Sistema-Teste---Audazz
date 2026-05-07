import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { Hexagon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login | Audazz Nexus OS',
  description: 'Acesse o sistema Audazz Nexus OS com seu CPF e senha.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Premium Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/login-bg.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px]" />

      {/* Login Container */}
      <div className="w-full max-w-[480px] relative z-10">
        <div className="glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-[40px] relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary rounded-[22px] flex items-center justify-center shadow-2xl shadow-primary/40 group transition-all duration-500 hover:rotate-[10deg]">
                <Hexagon className="w-10 h-10 text-white stroke-[1.5px]" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                  AUDAZZ
                </h1>
                <p className="text-muted-foreground font-medium">
                  Nexus OS <span className="mx-2 text-white/20">•</span> Portal de Acesso
                </p>
              </div>
            </div>

            {/* Login Form Component */}
            <LoginForm />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-between px-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">
            © 2024 Audazz Group. All Rights Reserved.
          </p>
          <div className="flex gap-4">
             <span className="text-[10px] uppercase tracking-[0.1em] text-white/40">v2.4.0</span>
          </div>
        </div>
      </div>
    </main>
  )
}
