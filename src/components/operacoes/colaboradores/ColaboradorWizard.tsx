"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { collaboratorFullSchema, CollaboratorFullValues } from "@/lib/schemas/collaborator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { useCollaborators } from "@/hooks/use-collaborators"
import { Check, ChevronRight, ChevronLeft, Loader2, User, Briefcase, Wallet, ShieldCheck, UserPlus, Camera, Plus, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { formatCPF } from "@/lib/utils"

export function ColaboradorWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [createdData, setCreatedData] = useState<{ accessId: string, password: string } | null>(null)
  const { isLoading, handleCreate } = useCollaborators()
  
  const form = useForm<CollaboratorFullValues>({
    resolver: zodResolver(collaboratorFullSchema) as any,
    defaultValues: {
      role: "criativo",
      ativo: true,
      podeSerAlocado: true,
      cargaHoraria: 40,
      diasTrabalho: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      vinculo: "PJ",
      senioridade: "Pleno",
      departamento: "Design",
      tipoRemuneracao: "Salário fixo",
      dataEntrada: new Date(),
      dataNascimento: new Date(1995, 0, 1),
      horarioInicio: "09:00",
      horarioFim: "18:00",
      especialidades: [],
      beneficios: []
    }
  })

  const { register, handleSubmit, control, formState: { errors } } = form

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: any[] = []
    if (step === 1) fieldsToValidate = ["nome", "cpf", "emailProfissional"]
    if (step === 2) fieldsToValidate = ["cargo", "departamento"]
    if (step === 3) fieldsToValidate = ["vinculo"]
    
    console.log(`Validating step ${step} fields:`, fieldsToValidate)
    const isValid = await form.trigger(fieldsToValidate)
    
    if (isValid) {
      setStep(s => Math.min(s + 1, 4))
    } else {
      console.warn("Validation failed for fields:", form.formState.errors)
      toast.error("Por favor, preencha os campos obrigatórios corretamente.")
    }
  }
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data: CollaboratorFullValues) => {
    console.log("Submitting collaborator data:", data)
    const result: any = await handleCreate(data)
    if (result && result.success) {
      setCreatedData({
        accessId: result.accessId,
        password: result.password
      })
    } else {
      console.error("Submission failed:", result)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado!`)
  }

  const steps = [
    { id: 1, title: "Pessoal", icon: User },
    { id: 2, title: "Profissional", icon: Briefcase },
    { id: 3, title: "Financeiro", icon: Wallet },
    { id: 4, title: "Acesso", icon: ShieldCheck },
  ]

  if (createdData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admissão Concluída!</h2>
          <p className="text-muted-foreground mt-2">
            O acesso ao Portal Audazz foi criado com sucesso.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 space-y-4 max-w-sm mx-auto">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">ID de Acesso (CPF)</Label>
            <div className="flex items-center gap-2 bg-secondary/30 p-3 rounded-xl">
              <code className="flex-1 text-lg font-mono">{createdData.accessId}</code>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(createdData.accessId, "CPF")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Senha Provisória</Label>
            <div className="flex items-center gap-2 bg-secondary/30 p-3 rounded-xl">
              <code className="flex-1 text-lg font-mono">{createdData.password}</code>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(createdData.password, "Senha")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={onComplete}
          className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full px-12 h-14 text-lg font-bold"
        >
          Concluir e Voltar
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      {/* Header Estilo Modal */}
      <div className="p-8 pb-4">
        <div className="w-12 h-12 bg-audazz-blue/10 rounded-2xl flex items-center justify-center mb-6">
          <UserPlus className="w-6 h-6 text-audazz-blue" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Admitir Novo Talento</h2>
        <p className="text-muted-foreground mt-2">
          Siga as etapas para integrar um novo colaborador ao Nexus OS.
        </p>
      </div>

      {/* Indicador de Progresso Compacto */}
      <div className="px-8 py-6 border-y border-white/5 bg-white/[0.02]">
        <div className="flex justify-between relative">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                step >= s.id 
                  ? "bg-audazz-blue border-audazz-blue text-white shadow-lg shadow-audazz-blue/30" 
                  : "bg-secondary/50 border-transparent text-muted-foreground"
              }`}>
                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? "text-audazz-blue" : "text-muted-foreground/50"}`}>
                {s.title}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-10 right-10 h-[2px] bg-white/5 -z-0">
            <motion.div 
              className="h-full bg-audazz-blue shadow-[0_0_10px_rgba(0,113,227,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step - 1) * 33.33}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo do Step */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-1 mb-2">
                  <h3 className="text-xl font-bold">Informações Pessoais</h3>
                  <p className="text-sm text-muted-foreground">Dados básicos e de contato.</p>
                </div>
                
                <div className="col-span-2 flex justify-center pb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-secondary/50 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-audazz-blue/50 cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-audazz-blue">
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase">Foto</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-audazz-blue text-white p-1.5 rounded-full shadow-lg">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input {...register("nome")} placeholder="Ex: Lucas Oliveira" className="bg-secondary/30 border-none rounded-xl h-11" />
                  {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input 
                    {...register("cpf")} 
                    onChange={(e) => {
                      e.target.value = formatCPF(e.target.value);
                      register("cpf").onChange(e);
                    }}
                    placeholder="000.000.000-00" 
                    className="bg-secondary/30 border-none rounded-xl h-11" 
                    maxLength={14}
                  />
                  {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>E-mail Profissional</Label>
                  <Input {...register("emailProfissional")} placeholder="lucas@audazz.com" className="bg-secondary/30 border-none rounded-xl h-11" />
                  {errors.emailProfissional && <p className="text-xs text-destructive">{errors.emailProfissional.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input {...register("whatsapp")} placeholder="(11) 99999-9999" className="bg-secondary/30 border-none rounded-xl h-11" />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-1 mb-2">
                  <h3 className="text-xl font-bold">Dados Profissionais</h3>
                  <p className="text-sm text-muted-foreground">Cargo, time e horários.</p>
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input {...register("cargo")} placeholder="Ex: Senior UI Designer" className="bg-secondary/30 border-none rounded-xl h-11" />
                  {errors.cargo && <p className="text-xs text-destructive">{errors.cargo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Controller
                    name="departamento"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-secondary/30 border-none rounded-xl h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Tráfego Pago">Tráfego Pago</SelectItem>
                          <SelectItem value="Gestão de Projetos">Gestão de Projetos</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-1 mb-2">
                  <h3 className="text-xl font-bold">Financeiro</h3>
                  <p className="text-sm text-muted-foreground">Remuneração e dados bancários.</p>
                </div>
                <div className="space-y-2">
                  <Label>Salário / Fee (Opcional)</Label>
                  <Input 
                    type="number"
                    placeholder="R$ 0,00" 
                    className="bg-secondary/30 border-none rounded-xl h-11"
                    {...register("salarioMensal", { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Contrato</Label>
                  <Controller
                    name="vinculo"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-secondary/30 border-none rounded-xl h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PJ">PJ</SelectItem>
                          <SelectItem value="CLT">CLT</SelectItem>
                          <SelectItem value="Freelancer">Freelance</SelectItem>
                          <SelectItem value="Sócio">Sócio</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-1 mb-2">
                  <h3 className="text-xl font-bold">Nível de Acesso</h3>
                  <p className="text-sm text-muted-foreground">Defina o papel no sistema.</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Role (Permissão)</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-secondary/30 border-none rounded-xl h-11">
                          <SelectValue placeholder="Selecione o nível de permissão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="gestor">Gestor</SelectItem>
                          <SelectItem value="criativo">Criativo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Estilo Modal */}
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
          <Button 
            type="button"
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className="rounded-full gap-2 font-bold hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>

          <div className="flex gap-3">
            {step < 4 ? (
              <Button 
                type="button"
                onClick={nextStep}
                className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full px-10 gap-2 font-bold shadow-lg shadow-audazz-blue/20"
              >
                Próximo <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full px-10 gap-2 font-bold shadow-lg shadow-audazz-blue/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Finalizar Admissão</>}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

