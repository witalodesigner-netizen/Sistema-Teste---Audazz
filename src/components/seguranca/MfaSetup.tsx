"use client"

import { useState } from "react"
import { ShieldCheck, Smartphone, Lock, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function MfaSetup() {
  const [step, setStep] = useState(1)
  const [mfaEnabled, setMfaEnabled] = useState(false)

  const handleNext = () => setStep(s => s + 1)
  
  const handleEnable = () => {
    setMfaEnabled(true)
    setStep(4)
    toast.success("MFA ativado com sucesso!")
  }

  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-12 backdrop-blur-xl max-w-2xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-[2rem] bg-audazz-blue/10 border border-audazz-blue/20">
            <Smartphone className="w-12 h-12 text-audazz-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Autenticação em Duas Etapas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Adicione uma camada extra de segurança à sua conta. Para entrar, você precisará da sua senha e de um código do seu celular.
            </p>
          </div>
          <Button onClick={handleNext} className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl h-12 px-12 font-bold gap-2">
            Começar Configuração
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-audazz-blue flex items-center justify-center font-bold">1</div>
            <h3 className="text-lg font-bold">Escaneie o QR Code</h3>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-3xl">
              {/* Espaço para QR Code Real */}
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">Use Google Authenticator, Authy ou similar.</p>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setStep(1)}>Cancelar</Button>
            <Button onClick={handleNext} className="bg-audazz-blue rounded-xl px-8 h-11">Próximo Passo</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-audazz-blue flex items-center justify-center font-bold">2</div>
            <h3 className="text-lg font-bold">Confirme o Código</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Digite o código de 6 dígitos gerado no seu aplicativo.</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Input key={i} maxLength={1} className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-background/50 border-white/5" />
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
            <Button onClick={handleEnable} className="bg-green-500 hover:bg-green-600 rounded-xl px-8 h-11 gap-2">
              <ShieldCheck className="w-4 h-4" />
              Ativar MFA
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-[2rem] bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">MFA Ativo e Protegido!</h3>
            <p className="text-muted-foreground text-sm">Sua conta agora possui o nível máximo de proteção.</p>
          </div>
          
          <div className="bg-background/20 p-6 rounded-[2rem] border border-white/5 w-full space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Códigos de Recuperação</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 bg-background/50 rounded-lg">ABCD-1234</div>
              <div className="p-2 bg-background/50 rounded-lg">EFGH-5678</div>
              <div className="p-2 bg-background/50 rounded-lg">IJKL-9012</div>
              <div className="p-2 bg-background/50 rounded-lg">MNOP-3456</div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl text-[10px] font-bold uppercase">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Guarde estes códigos em local seguro.
            </div>
          </div>

          <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl border-white/5 bg-background/50 h-11 px-8">
            Voltar ao Início
          </Button>
        </div>
      )}
    </div>
  )
}
