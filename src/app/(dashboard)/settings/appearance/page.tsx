"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { BrandingSettings } from "@/components/settings/BrandingSettings"

import { useState, useEffect } from "react"
import { getBrandingConfig } from "@/lib/actions/branding"

export default function AppearancePage() {
  const [systemName, setSystemName] = useState("Audazz Nexus OS")

  useEffect(() => {
    getBrandingConfig().then(res => {
      if (res.success && res.data.systemName) setSystemName(res.data.systemName)
    })

    const channel = new BroadcastChannel("branding_sync")
    channel.onmessage = () => {
      getBrandingConfig().then(res => {
        if (res.success && res.data.systemName) setSystemName(res.data.systemName)
      })
    }
    return () => channel.close()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="border-none bg-secondary/10">
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Personalize o visual do seu {systemName}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="flex flex-col gap-1 cursor-pointer text-left items-start">
              <span className="text-sm font-bold">Modo Escuro</span>
              <span className="text-xs font-normal text-muted-foreground">Alternar entre temas claro e escuro.</span>
            </Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex flex-col gap-1 cursor-pointer text-left items-start">
              <span className="text-sm font-bold">Reduzir Animações</span>
              <span className="text-xs font-normal text-muted-foreground">Melhorar a performance em dispositivos antigos.</span>
            </Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t border-white/5">
        <BrandingSettings />
      </div>
    </motion.div>
  )
}
