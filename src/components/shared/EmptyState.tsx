"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-white/5"
    >
      <div className="w-20 h-20 bg-audazz-blue/10 rounded-3xl flex items-center justify-center text-audazz-blue shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && (
        <Button 
          onClick={onAction}
          className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full px-8 h-12 font-bold shadow-lg shadow-audazz-blue/20"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
