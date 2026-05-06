"use client"

import * as React from "react"
import { CalendarIcon, Paperclip, Link as LinkIcon, Trash2, CheckCircle2, Plus, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ProjectCardModalProps {
  isOpen: boolean
  onClose: () => void
  project?: any // If null, it's a "Create" modal
  onSave: (data: any) => void
  onDelete?: (id: string) => void
}

const STATUS_OPTIONS = [
  "A fazer",
  "Em produção",
  "Revisão Interna",
  "Alteração",
  "Aprovação Cliente",
  "Aprovado"
]

const PRIORITY_OPTIONS = [
  { id: "baixa", label: "Baixa" },
  { id: "media", label: "Média" },
  { id: "alta", label: "Alta" },
  { id: "urgente", label: "Urgente" }
]

const MOCK_CLIENTS = [
  { id: "c1", name: "Nike Corp", status: "Ativo" },
  { id: "c2", name: "Apple Inc", status: "Ativo" },
  { id: "c3", name: "Coca-Cola", status: "Inativo" },
]

const MOCK_COLLABORATORS = [
  { id: "u1", name: "Witalo A." },
  { id: "u2", name: "Ana B." },
  { id: "u3", name: "Lucas C." },
]

export function ProjectCardModal({ isOpen, onClose, project, onSave, onDelete }: ProjectCardModalProps) {
  const [formData, setFormData] = React.useState<any>({
    title: "",
    description: "",
    status: "A fazer",
    priorities: [],
    client: "",
    assignees: [],
    deliveryDate: undefined,
    references: [],
    deliverables: []
  })

  const [refInput, setRefInput] = React.useState("")
  const [delivInput, setDelivInput] = React.useState("")

  React.useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        priorities: Array.isArray(project.priorities) ? project.priorities : [],
        assignees: Array.isArray(project.assignees) ? project.assignees : (project.assignee ? [project.assignee] : []),
        references: Array.isArray(project.references) ? project.references : [],
        deliverables: Array.isArray(project.deliverables) ? project.deliverables : []
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "A fazer",
        priorities: [],
        client: "",
        assignees: [],
        deliveryDate: undefined,
        references: [],
        deliverables: []
      })
    }
  }, [project, isOpen])

  const addReference = () => {
    if (!refInput) return
    const isLink = refInput.startsWith("http")
    setFormData((prev: any) => ({
      ...prev,
      references: [...prev.references, { type: isLink ? "link" : "file", value: refInput, name: refInput.split("/").pop() }]
    }))
    setRefInput("")
  }

  const addDeliverable = () => {
    if (!delivInput) return
    const isLink = delivInput.startsWith("http")
    setFormData((prev: any) => ({
      ...prev,
      deliverables: [...prev.deliverables, { type: isLink ? "link" : "file", value: delivInput, name: delivInput.split("/").pop() }]
    }))
    setDelivInput("")
  }

  const togglePriority = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      priorities: prev.priorities.includes(id) 
        ? prev.priorities.filter((p: string) => p !== id)
        : [...prev.priorities, id]
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none bg-background/80 backdrop-blur-2xl p-8 shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black tracking-tighter text-audazz-blue uppercase">
            {project ? "Editar Projeto" : "Novo Projeto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Título do Projeto</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Campanha de Inverno Nike"
              className="rounded-2xl bg-background border-none h-12 text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="rounded-2xl bg-background border-none h-12 font-bold">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none bg-background shadow-2xl">
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt} className="font-medium">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data de Entrega */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Data de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-bold rounded-2xl bg-background border-none h-12",
                      !formData.deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deliveryDate ? format(formData.deliveryDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deliveryDate}
                    onSelect={(date) => setFormData({...formData, deliveryDate: date})}
                    initialFocus
                    locale={ptBR}
                    className="rounded-3xl"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cliente</Label>
              <Select value={formData.client} onValueChange={(val) => setFormData({...formData, client: val})}>
                <SelectTrigger className="rounded-2xl bg-background border-none h-12 font-bold">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none bg-background shadow-2xl">
                  {MOCK_CLIENTS.filter(c => c.status === "Ativo").map(c => (
                    <SelectItem key={c.id} value={c.name} className="font-medium">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Responsáveis */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Responsáveis</Label>
              <Select 
                onValueChange={(val) => {
                  if (!formData.assignees.includes(val)) {
                    setFormData({...formData, assignees: [...formData.assignees, val]})
                  }
                }}
              >
                <SelectTrigger className="rounded-2xl bg-background border-none h-12 font-bold">
                  <SelectValue placeholder="Adicionar responsáveis" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none bg-background shadow-2xl">
                  {MOCK_COLLABORATORS.map(u => (
                    <SelectItem key={u.id} value={u.name} className="font-medium">{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.assignees.map((a: string) => (
                  <Badge key={a} variant="secondary" className="rounded-full gap-1 pl-3 pr-1 py-1 bg-audazz-blue/10 text-audazz-blue border-none font-bold text-[10px]">
                    {a}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full p-0 hover:bg-transparent text-audazz-blue"
                      onClick={() => setFormData({...formData, assignees: formData.assignees.filter((x:string) => x !== a)})}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Prioridade (Múltipla)</Label>
            <div className="flex flex-wrap gap-6">
              {PRIORITY_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={opt.id} 
                    checked={formData.priorities.includes(opt.id)}
                    onCheckedChange={() => togglePriority(opt.id)}
                    className="border-muted-foreground data-[state=checked]:bg-audazz-blue data-[state=checked]:border-audazz-blue"
                  />
                  <label htmlFor={opt.id} className="text-sm font-bold leading-none cursor-pointer">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Descrição do Projeto</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalhes do que precisa ser feito..."
              className="rounded-2xl bg-background border-none min-h-[120px] font-medium"
            />
          </div>

          {/* Referências */}
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Arquivos e Links de Referência</Label>
            <div className="flex gap-2">
              <Input 
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="Cole um link ou nome de arquivo..." 
                className="rounded-2xl bg-background border-none flex-1" 
              />
              <Button onClick={addReference} size="icon" className="rounded-xl bg-audazz-blue shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.references.map((ref: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl border border-secondary/20 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {ref.type === 'link' ? <LinkIcon className="w-4 h-4 text-blue-500 shrink-0" /> : <Paperclip className="w-4 h-4 text-orange-500 shrink-0" />}
                    <span className="text-[11px] font-bold truncate">{ref.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <a href={ref.value} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3" /></a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-500"
                      onClick={() => setFormData({...formData, references: formData.references.filter((_:any, idx:number) => idx !== i)})}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arquivos Finais */}
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Arquivos e Links de Entrega Final</Label>
            <div className="flex gap-2">
              <Input 
                value={delivInput}
                onChange={(e) => setDelivInput(e.target.value)}
                placeholder="Link da entrega final..." 
                className="rounded-2xl bg-background border-none flex-1" 
              />
              <Button onClick={addDeliverable} size="icon" className="rounded-xl bg-green-500 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.deliverables.map((ref: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl border border-green-500/20 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-[11px] font-bold truncate">{ref.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <a href={ref.value} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3" /></a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-500"
                      onClick={() => setFormData({...formData, deliverables: formData.deliverables.filter((_:any, idx:number) => idx !== i)})}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between border-t pt-6">
          <div className="flex gap-2 w-full sm:w-auto">
            {project && (
              <Button 
                variant="destructive" 
                className="rounded-full font-bold px-6"
                onClick={() => onDelete?.(project.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
            )}
            <Button variant="outline" className="rounded-full font-bold px-6" onClick={onClose}>Cancelar</Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {project && (
              <Button className="rounded-full font-bold px-6 bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Concluído
              </Button>
            )}
            <Button 
              className="rounded-full font-bold px-8 bg-audazz-blue hover:bg-audazz-blue/90"
              onClick={handleSave}
            >
              {project ? "Salvar Alterações" : "Criar Card"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Badge({ children, className, variant, ...props }: any) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props}>
      {children}
    </div>
  )
}
