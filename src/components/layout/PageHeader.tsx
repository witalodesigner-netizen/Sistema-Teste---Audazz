import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-audazz-blue/10 text-audazz-blue">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <h1 className="text-3xl font-black tracking-tight capitalize">
            {title} <span className="text-audazz-blue">.</span>
          </h1>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm font-medium pl-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}
