"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sun, Moon, Cloud, Clock, Calendar as CalendarIcon, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { getUserProfile } from "@/lib/actions/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WeatherWidget } from "./WeatherWidget"

export function Header() {
  const [time, setTime] = useState(new Date())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState({
    firstName: "Usuário",
    lastName: "Audazz",
    avatar: null as string | null
  })

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    
    // Carregar perfil inicial
    const loadProfile = async () => {
      const profile = await getUserProfile()
      if (profile) setUser(profile)
    }
    loadProfile()

    // Ouvir atualizações em tempo real
    const channel = new BroadcastChannel('user-profile-updates')
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_PROFILE') {
        setUser(event.data.profile)
      }
    }

    return () => {
      clearInterval(timer)
      channel.close()
    }
  }, [])

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-40 w-full glass border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="lg:hidden -ml-2" />
        {/* Clock Widget */}
        <div className="flex items-center gap-2 text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-full border">
          <Clock className="w-4 h-4 text-audazz-blue" />
          <span className="tabular-nums">{format(time, "HH:mm:ss")}</span>
        </div>

        {/* Calendar Widget */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-full border">
          <CalendarIcon className="w-4 h-4 text-audazz-blue" />
          <span className="capitalize">
            {format(time, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>

        {/* Weather Widget Dinâmico */}
        <div className="hidden lg:flex">
          <WeatherWidget />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full hover:scale-105 transition-transform"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        
        <div className="h-8 w-[1px] bg-border mx-2" />
        
        <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold leading-none">{user.firstName} {user.lastName}</span>
            <span className="text-xs text-muted-foreground">Administrador</span>
          </div>
          <Avatar className="h-9 w-9 border border-audazz-blue/20">
            <AvatarImage src={user.avatar || ""} className="object-cover" />
            <AvatarFallback className="bg-audazz-blue text-white font-bold text-xs">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
