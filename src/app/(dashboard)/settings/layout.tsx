"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { label: "Perfil", icon: User, href: "/settings" },
  { label: "Notificações", icon: Bell, href: "/settings/notifications" },
  { label: "Segurança", icon: Shield, href: "/settings/security" },
  { label: "Aparência", icon: Palette, href: "/settings/appearance" },
  { label: "Integrações", icon: Globe, href: "/settings/integrations" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="max-w-6xl space-y-8">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e conta do Nexus OS"
        icon={Settings}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.label}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 rounded-xl transition-all ${isActive ? 'bg-audazz-blue/10 text-audazz-blue font-bold shadow-sm' : 'hover:bg-secondary/50'}`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </aside>

        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}
