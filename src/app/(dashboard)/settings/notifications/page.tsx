"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="border-none bg-secondary/10">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Gerencie como e quando você recebe alertas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="flex flex-col gap-1 cursor-pointer">
              <span>Alertas de E-mail</span>
              <span className="text-xs font-normal text-muted-foreground">Receba resumos diários das atividades dos projetos.</span>
            </Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex flex-col gap-1 cursor-pointer">
              <span>Notificações Push</span>
              <span className="text-xs font-normal text-muted-foreground">Alertas em tempo real no navegador.</span>
            </Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
