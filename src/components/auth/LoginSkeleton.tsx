'use client'

import { motion } from 'framer-motion'

export function LoginSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <div className="h-10 w-40 bg-white/5 rounded-lg mx-auto animate-pulse" />
              <div className="h-4 w-60 bg-white/5 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>

            <div className="h-12 w-full bg-primary/20 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
