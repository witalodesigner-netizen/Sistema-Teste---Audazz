"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  Palette,
  Power
} from "lucide-react"
import { signOutMember } from "@/lib/firebase/portal-auth"
import { useRouter } from "next/navigation"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const navigation = [
  {
    title: "Operações",
    icon: Briefcase,
    url: "#",
    items: [
      { title: "Dashboard", url: "/" },
      { title: "Briefings", url: "/briefings" },
      { title: "Projetos", url: "/projects" },
      { title: "Colaboradores", url: "/operacoes/colaboradores" },
    ],
  },
  {
    title: "CRM",
    icon: Users,
    url: "#",
    items: [
      { title: "Clientes", url: "/clients" },
      { title: "Funil de Vendas", url: "/sales" },
    ],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    url: "#",
    items: [
      { title: "Fluxo de Caixa", url: "/finance" },
      { title: "Recorrência", url: "/subscriptions" },
    ],
  },
  {
    title: "Performance",
    icon: BarChart3,
    url: "#",
    items: [
      { title: "Relatórios BI", url: "/bi" },
      { title: "Produtividade", url: "/productivity" },
    ],
  },
  {
    title: "Ativos",
    icon: Palette,
    url: "/assets",
    items: [
      { title: "Brand Book", url: "/brand-book" },
    ],
  },
  {
    title: "Sistema",
    icon: Settings,
    url: "#",
    items: [
      { title: "Configurações", url: "/settings" },
      { title: "Ajuda", url: "/help" },
    ],
  },
]

import { getBrandingConfig } from "@/lib/actions/branding"
import { useTheme } from "next-themes"

import { getUserProfile } from "@/lib/actions/user"

export function AppSidebar() {
  const [branding, setBranding] = React.useState({ lightLogo: "", darkLogo: "", systemName: "Audazz", slogan: "Gestão de Alta Performance" })
  const [user, setUser] = React.useState({ firstName: "Usuário", lastName: "Audazz", avatar: null as string | null })
  const { theme, resolvedTheme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOutMember()
      // Clear cookie
      document.cookie = "portal-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  React.useEffect(() => {
    const loadData = async () => {
      const bResult = await getBrandingConfig()
      if (bResult.success && bResult.data) setBranding(bResult.data)
      
      const uResult = await getUserProfile()
      if (uResult) setUser(uResult)
    }
    loadData()

    // Sincronização de Branding
    const bChannel = new BroadcastChannel("branding_sync")
    bChannel.onmessage = (event) => {
      if (event.data === "update") {
        getBrandingConfig().then(res => { if(res.success) setBranding(res.data) })
      }
    }

    // Sincronização de Perfil
    const uChannel = new BroadcastChannel('user-profile-updates')
    uChannel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_PROFILE') {
        setUser(event.data.profile)
      }
    }

    return () => {
      bChannel.close()
      uChannel.close()
    }
  }, [])

  const currentTheme = resolvedTheme || theme
  const activeLogo = currentTheme === "dark" ? branding.darkLogo : branding.lightLogo

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-3 px-2">
          {activeLogo ? (
            <div className="h-10 w-auto flex items-center group-data-[collapsible=icon]:justify-center transition-all">
              <img src={activeLogo} alt="Logo" className="h-8 w-auto object-contain" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-audazz-blue flex items-center justify-center shrink-0 shadow-lg shadow-audazz-blue/20">
                <span className="text-white font-black text-xl leading-none">
                  {branding.systemName?.[0] || 'A'}
                </span>
              </div>
              <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-base tracking-tight text-foreground leading-none">
                  {branding.systemName}
                </span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-70">
                  {branding.slogan}
                </span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar">
        {navigation.map((group) => (
          <SidebarGroup key={group.title} className="px-4">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden mt-4 first:mt-0">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <group.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="py-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-14" asChild>
              <Link href="/settings">
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarImage src={user.avatar || ""} className="object-cover" />
                  <AvatarFallback className="bg-audazz-blue text-white text-xs">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0.5 truncate group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-bold truncate">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] text-muted-foreground truncate uppercase">Administrador</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="h-12 mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <Power className="w-5 h-5" />
              <div className="flex flex-col items-start gap-0.5 truncate group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-bold">Encerrar Sessão</span>
                <span className="text-[10px] opacity-70 uppercase">Sair do Sistema</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
