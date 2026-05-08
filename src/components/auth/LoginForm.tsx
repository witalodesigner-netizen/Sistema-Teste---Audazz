'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, User, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { signInWithCpf } from '@/lib/firebase/portal-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido').max(14),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signInWithCpf(data.cpf, data.password)
      
      if (!result.success || !result.user) {
        throw new Error(result.error || 'Erro ao obter dados do usuário')
      }

      // Get the ID token to store in a cookie for the middleware
      const idToken = await result.user.getIdToken()
      
      // Set the cookie (valid for 7 days)
      const expires = new Date()
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000))
      document.cookie = `portal-token=${idToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
      
      setSuccess(true)
      
      // Redirecionamento acontece via middleware ou listener no layout
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message === 'auth/user-not-found' || err.message === 'auth/wrong-password' || err.message === 'auth/invalid-credential') {
        setError('CPF ou senha inválidos. Verifique seus dados.')
      } else {
        setError('Ocorreu um erro ao realizar o login. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm p-4 rounded-xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p>Acesso concedido! Redirecionando...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-muted-foreground ml-1">
              CPF (ID de Acesso)
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <User className="w-5 h-5" />
              </div>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary focus:border-primary transition-all text-lg"
                autoComplete="username"
                {...register('cpf', {
                  onChange: (e) => {
                    const formatted = formatCPF(e.target.value)
                    e.target.value = formatted
                    setValue('cpf', formatted)
                  }
                })}
              />
            </div>
            {errors.cpf && (
              <p className="text-destructive text-xs mt-1 ml-1 font-medium">{errors.cpf.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-muted-foreground ml-1">
              Senha do Sistema
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary focus:border-primary transition-all text-lg"
                autoComplete="current-password"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || success}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-semibold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span className="relative z-10">Acessar Sistema</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <motion.div 
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </>
          )}
        </Button>

        <div className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Esqueceu sua senha ou não tem acesso? <br />
            Entre em contato com o suporte da <span className="text-primary font-semibold">Audazz</span>.
          </p>
        </div>
      </form>
    </motion.div>
  )
}
