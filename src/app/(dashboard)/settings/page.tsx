"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, Mail, Phone, Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUserProfile, saveUserProfile } from "@/lib/actions/user"
import { getBrandingConfig } from "@/lib/actions/branding"

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState({
    firstName: "Usuário",
    lastName: "Audazz",
    email: "admin@audazz.studio",
    whatsapp: "",
    avatar: null as string | null
  })

  // Carregar dados ao iniciar
  const [systemName, setSystemName] = React.useState("Audazz")

  React.useEffect(() => {
    async function load() {
      const b = await getBrandingConfig()
      if (b.success && b.data.systemName) setSystemName(b.data.systemName)
      
      const u = await getUserProfile()
      if (u) setProfile(u)
      setLoading(false)
    }
    load()

    const channel = new BroadcastChannel('branding_sync')
    channel.onmessage = () => {
      getBrandingConfig().then(b => {
        if (b.success && b.data.systemName) setSystemName(b.data.systemName)
      })
    }
    return () => channel.close()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }))
        toast.success("Foto carregada! Não esqueça de salvar as alterações.")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log('Tentando salvar perfil:', profile)
      const result = await saveUserProfile(profile)
      
      if (result.success) {
        toast.success("Perfil atualizado com sucesso!")
        
        // Notificar outros componentes (Topbar, etc)
        const channel = new BroadcastChannel('user-profile-updates')
        channel.postMessage({ type: 'UPDATE_PROFILE', profile })
        channel.close()
      } else {
        toast.error(result.error || "Erro ao salvar perfil.")
      }
    } catch (error) {
      console.error('Erro no handleSave:', error)
      toast.error("Erro crítico ao salvar perfil.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-audazz-blue" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <Card className="border-none bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-black">Informações do Perfil</CardTitle>
          <CardDescription>Gerencie sua identidade e contatos no {systemName}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-white/5">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-audazz-blue/20 ring-4 ring-audazz-blue/5">
                <AvatarImage src={profile.avatar || ""} className="object-cover" />
                <AvatarFallback className="bg-audazz-blue text-white text-3xl font-black">
                  {profile.firstName?.[0] || 'U'}{profile.lastName?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-audazz-blue rounded-full border-4 border-[#0A0A0A] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="text-lg font-bold">Sua Foto</h4>
              <p className="text-sm text-muted-foreground">Recomendado: 400x400px. PNG ou JPG.</p>
              <Button 
                variant="link" 
                onClick={() => setProfile(prev => ({ ...prev, avatar: null }))}
                className="p-0 h-auto text-red-500 text-xs font-bold uppercase tracking-wider hover:no-underline opacity-50 hover:opacity-100"
              >
                Remover Foto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  id="firstName" 
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                />
              </div>
            </div>

            {/* Sobrenome */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sobrenome</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  id="lastName" 
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Profissional</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  id="email" 
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Número de WhatsApp</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  id="whatsapp" 
                  value={profile.whatsapp}
                  onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="(11) 99999-9999" 
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-audazz-blue" />
              Segurança e Acesso
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nova Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                  <Input 
                    id="newPassword" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-audazz-blue"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirmar Nova Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                  <Input 
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-2xl h-14 px-12 font-bold gap-3 shadow-lg shadow-audazz-blue/20 min-w-[200px] text-white"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
