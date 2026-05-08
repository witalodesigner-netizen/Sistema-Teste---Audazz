"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useClients } from "@/hooks/use-clients"
import { Check, ChevronRight, ChevronLeft, Loader2, Building2, Mail, Phone, Plus, CheckCircle2, Globe, FileText } from "lucide-react"
import { toast } from "sonner"

const ClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional()
})

type ClientValues = z.infer<typeof ClientSchema>

export function ClientWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1)
  const [isFinished, setIsFinished] = useState(false)
  const { isLoading, handleCreate } = useClients()
  
  const form = useForm<ClientValues>({
    resolver: zodResolver(ClientSchema)
  })

  const { register, handleSubmit, formState: { errors } } = form

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? ["name"] : []
    const isValid = await form.trigger(fieldsToValidate as any)
    if (isValid) setStep(s => Math.min(s + 1, 2))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data: ClientValues) => {
    console.log("Submitting client data:", data)
    const result = await handleCreate(data)
    if (result && result.success) {
      setIsFinished(true)
    } else {
      console.error("Client creation failed:", result)
    }
  }

  const steps = [
    { id: 1, title: "Empresa", icon: Building2 },
    { id: 2, title: "Contato", icon: Mail },
  ]

  if (isFinished) {
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
          <h2 className="text-3xl font-bold tracking-tight">Cliente Cadastrado!</h2>
          <p className="text-muted-foreground mt-2">
            A empresa foi adicionada com sucesso à base da Audazz.
          </p>
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
      <div className="p-8 pb-4">
        <div className="w-12 h-12 bg-audazz-blue/10 rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-6 h-6 text-audazz-blue" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Cliente</h2>
        <p className="text-muted-foreground mt-2">
          Cadastre uma nova empresa para gestão de projetos.
        </p>
      </div>

      <div className="px-8 py-6 border-y border-white/5 bg-white/[0.02]">
        <div className="flex justify-between relative max-w-xs mx-auto">
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
          <div className="absolute top-5 left-5 right-5 h-[2px] bg-white/5 -z-0">
            <motion.div 
              className="h-full bg-audazz-blue shadow-[0_0_10px_rgba(0,113,227,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step - 1) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error("Validation Errors:", errors);
        toast.error("Preencha todos os campos obrigatórios corretamente.");
      })} className="p-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input {...register("name")} placeholder="Ex: TechFlow Solutions LTDA" className="bg-secondary/30 border-none rounded-xl h-11" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia (Opcional)</Label>
                  <Input {...register("tradeName")} placeholder="Ex: TechFlow" className="bg-secondary/30 border-none rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ (Opcional)</Label>
                  <Input {...register("cnpj")} placeholder="00.000.000/0000-00" className="bg-secondary/30 border-none rounded-xl h-11" />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>E-mail Principal</Label>
                  <Input {...register("email")} placeholder="contato@empresa.com" className="bg-secondary/30 border-none rounded-xl h-11" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Telefone / WhatsApp</Label>
                  <Input {...register("phone")} placeholder="(11) 99999-9999" className="bg-secondary/30 border-none rounded-xl h-11" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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
            {step < 2 ? (
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
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Finalizar Cadastro</>}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
