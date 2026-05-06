"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { Library, Download, FileText, ImageIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function MateriaisPage() {
  const materiais = [] // Mocado por enquanto

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Materiais e Ativos</h1>
          <p className="text-muted-foreground font-medium">Acesse guias de marca, logos e outros arquivos úteis.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar material..." className="pl-10 rounded-xl bg-secondary/30 border-none" />
        </div>
      </div>

      {materiais.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Grid de materiais aqui */}
        </div>
      ) : (
        <EmptyState 
          icon={Library}
          title="Nenhum material disponível"
          description="Ainda não foram disponibilizados materiais ou guias de marca para sua empresa. Entre em contato com seu gestor de conta."
          actionLabel="Verificar Novamente"
        />
      )}
    </div>
  )
}
