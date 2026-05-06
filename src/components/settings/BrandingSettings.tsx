"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X, Check, Image as ImageIcon, RectangleHorizontal, Sun, Moon, Loader2, Globe, LayoutTemplate, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { saveBrandingConfig, getBrandingConfig } from "@/lib/actions/branding"

export function BrandingSettings() {
  const [lightLogo, setLightLogo] = useState<string | null>(null)
  const [darkLogo, setDarkLogo] = useState<string | null>(null)
  const [favicon, setFavicon] = useState<string | null>(null)
  const [systemName, setSystemName] = useState("Audazz Nexus OS")
  const [slogan, setSlogan] = useState("Gestão de Alta Performance")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLogos = async () => {
      const result = await getBrandingConfig()
      if (result.success && result.data) {
        if (result.data.lightLogo) setLightLogo(result.data.lightLogo)
        if (result.data.darkLogo) setDarkLogo(result.data.darkLogo)
        if (result.data.favicon) setFavicon(result.data.favicon)
        if (result.data.systemName) setSystemName(result.data.systemName)
        if (result.data.slogan) setSlogan(result.data.slogan)
      }
      setLoading(false)
    }
    loadLogos()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-audazz-blue" />
        <p className="text-muted-foreground animate-pulse font-bold">Sincronizando Identidade Visual...</p>
      </div>
    )
  }

  const handleFileUpload = (type: 'light' | 'dark' | 'favicon', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = type === 'favicon' ? 512 * 1024 : 2 * 1024 * 1024 // 512KB for favicon, 2MB for logos
      if (file.size > maxSize) {
        toast.error(`O arquivo deve ter no máximo ${type === 'favicon' ? '512KB' : '2MB'}`)
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'light') setLightLogo(reader.result as string)
        else if (type === 'dark') setDarkLogo(reader.result as string)
        else setFavicon(reader.result as string)
        toast.success(`${type === 'favicon' ? 'Favicon' : 'Logo'} carregada!`)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveBrandingConfig({ 
      lightLogo: lightLogo || "", 
      darkLogo: darkLogo || "",
      systemName: systemName,
      slogan: slogan,
      favicon: favicon || ""
    })
    if (result.success) {
      toast.success("Identidade visual atualizada com sucesso!")
      // Dispara sinal para outros componentes
      const channel = new BroadcastChannel("branding_sync")
      channel.postMessage("update")
      channel.close()
    } else {
      toast.error("Erro ao salvar configurações")
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Nome do Sistema e Favicon */}
      <Card className="border-none bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-audazz-blue/10 flex items-center justify-center border border-audazz-blue/20">
              <LayoutTemplate className="w-5 h-5 text-audazz-blue" />
            </div>
            <div>
              <CardTitle className="text-lg">Configurações Gerais</CardTitle>
              <CardDescription>Defina o nome e o ícone global da sua plataforma.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Nome do Sistema */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Plataforma</Label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder="Ex: Audazz Nexus OS"
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30 text-lg font-semibold"
                />
              </div>
              <p className="text-[10px] text-muted-foreground px-1 italic">
                * Este nome será exibido nas abas do navegador, sidebar e cabeçalhos.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Slogan do Sistema</Label>
              <div className="relative group">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-audazz-blue transition-colors" />
                <Input 
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ex: Gestão de Alta Performance"
                  className="pl-12 h-14 rounded-2xl border-none bg-background/50 focus-visible:ring-audazz-blue/30 text-lg font-semibold"
                />
              </div>
              <p className="text-[10px] text-muted-foreground px-1 italic">
                * Este texto aparece após o nome da sua marca no título da aba.
              </p>
            </div>
          </div>

          {/* Favicon */}
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Favicon (Ícone da Aba)</Label>
            <div className="relative group w-24 h-24 rounded-2xl bg-background/50 border-2 border-dashed border-white/5 flex items-center justify-center transition-all hover:border-audazz-blue/30 overflow-hidden cursor-pointer">
              {favicon ? (
                <img src={favicon} alt="Favicon" className="w-12 h-12 object-contain" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-audazz-blue transition-colors" />
              )}
              <input 
                type="file" 
                accept="image/x-icon,image/png,image/svg+xml"
                onChange={(e) => handleFileUpload('favicon', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {favicon && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setFavicon(null); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight italic">
              Recomendado: 32x32px ou 64x64px. PNG ou ICO.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo Modo Escuro - Para fundos claros */}
        <Card className="border-none bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Moon className="w-5 h-5 text-audazz-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg">Logo Modo Escuro</CardTitle>
                  <CardDescription>Para uso em fundos claros</CardDescription>
                </div>
              </div>
              {darkLogo && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDarkLogo(null)}
                  className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative group aspect-[3/1] rounded-3xl bg-[#0A0A0A] border-2 border-dashed border-white/5 flex flex-col items-center justify-center transition-all hover:border-audazz-blue/30 overflow-hidden">
              {darkLogo ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={darkLogo} 
                  alt="Logo Modo Escuro" 
                  className="max-h-[60%] w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-audazz-blue transition-colors">
                  <Upload className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Horizontal</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload('dark', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 bg-black/5 p-4 rounded-2xl border border-black/5">
              <RectangleHorizontal className="w-4 h-4 text-audazz-blue" />
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Recomendado: Formato Horizontal (PNG ou SVG)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Logo Modo Claro - Para fundos escuros */}
        <Card className="border-none bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center border border-black/5">
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Logo Modo Claro</CardTitle>
                  <CardDescription>Para uso em fundos escuros</CardDescription>
                </div>
              </div>
              {lightLogo && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setLightLogo(null)}
                  className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative group aspect-[3/1] rounded-3xl bg-white border-2 border-dashed border-black/5 flex flex-col items-center justify-center transition-all hover:border-audazz-blue/30 overflow-hidden">
              {lightLogo ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={lightLogo} 
                  alt="Logo Modo Claro" 
                  className="max-h-[60%] w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-audazz-blue transition-colors">
                  <Upload className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Horizontal</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload('light', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <RectangleHorizontal className="w-4 h-4 text-audazz-blue" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Recomendado: Formato Horizontal (PNG ou SVG)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview no Sistema */}
      <Card className="border-none bg-secondary/10 backdrop-blur-xl rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-audazz-blue" />
              Preview no Sistema
            </h4>
            <p className="text-sm text-muted-foreground">Veja como sua marca se comporta no {systemName}</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-2xl h-14 px-10 font-bold gap-3 shadow-lg shadow-audazz-blue/20"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            Confirmar Alterações
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Modo Dashboard (Dark)</Label>
            <div className="h-20 bg-[#0A0A0A] border border-white/5 rounded-2xl flex items-center px-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-audazz-blue/50" />
              {darkLogo ? (
                <img src={darkLogo} alt="Preview Dark" className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-4 opacity-20">
                  <div className="w-10 h-10 rounded-full bg-audazz-blue" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-white rounded-full" />
                    <div className="w-16 h-2 bg-white/50 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Modo Relatório (Light)</Label>
            <div className="h-20 bg-white border border-black/5 rounded-2xl flex items-center px-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-audazz-blue" />
              {lightLogo ? (
                <img src={lightLogo} alt="Preview Light" className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-4 opacity-10">
                  <div className="w-10 h-10 rounded-full bg-audazz-blue" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-black rounded-full" />
                    <div className="w-16 h-2 bg-black/50 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
