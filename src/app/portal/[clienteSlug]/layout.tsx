"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Library, MessageSquare, LogOut, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export default function PortalLayout({ children, params }: { children: ReactNode, params: { clienteSlug: string } }) {
  const pathname = usePathname()
  const slug = params.clienteSlug

  const menuItems = [
    { label: "Início", href: `/portal/${slug}`, icon: LayoutDashboard },
    { label: "Aprovações", href: `/portal/${slug}/aprovacoes`, icon: CheckSquare },
    { label: "Materiais", href: `/portal/${slug}/materiais`, icon: Library },
    { label: "Solicitações", href: `/portal/${slug}/solicitacoes`, icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden font-poppins">
      {/* Sidebar do Portal */}
      <aside className="w-72 bg-secondary/10 backdrop-blur-xl border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-audazz-blue rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Portal Audazz</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Nexus OS</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-audazz-blue text-white shadow-lg shadow-audazz-blue/20" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}
                `}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-audazz-blue"}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="portal-active" 
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Sair do Portal</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <div className="lg:hidden w-10 h-10 bg-audazz-blue rounded-xl" />
             <h2 className="text-lg font-bold">Olá, João Silva 👋</h2>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
            
            <div className="h-8 w-[1px] bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">João Silva</p>
                <p className="text-[10px] text-muted-foreground mt-1">Dono (Admin)</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-audazz-blue/20 ring-offset-background ring-2 ring-transparent hover:ring-audazz-blue/50 transition-all cursor-pointer">
                <AvatarFallback className="bg-secondary text-foreground font-bold">JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
