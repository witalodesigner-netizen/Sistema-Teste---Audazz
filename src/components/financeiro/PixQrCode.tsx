"use client"

import { useState } from "react"
import { QrCode, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PixQrCodeProps {
  qrCode: string
  payload: string
}

export function PixQrCode({ qrCode, payload }: PixQrCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(payload)
    setCopied(true)
    toast.success("Código PIX copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl flex flex-col items-center space-y-6">
      <div className="p-2 rounded-xl bg-audazz-blue/10 border border-audazz-blue/20 text-audazz-blue mb-2">
        <QrCode className="w-5 h-5" />
      </div>
      
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold">Pagar com PIX</h3>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Escaneie o código abaixo</p>
      </div>

      <div className="p-4 bg-white rounded-[2rem] shadow-2xl shadow-audazz-blue/10">
        {/* Simulação de imagem do QR Code */}
        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl">
          <img src={qrCode} alt="QR Code PIX" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="w-full space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-center text-muted-foreground">Ou copie o código abaixo</p>
        <div className="relative group">
          <input 
            readOnly 
            value={payload} 
            className="w-full bg-background/50 border border-white/5 rounded-2xl h-14 px-6 pr-12 text-xs font-mono text-muted-foreground focus:outline-none"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl hover:bg-audazz-blue/10 text-audazz-blue"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button variant="ghost" className="text-xs font-bold gap-2 text-muted-foreground hover:text-audazz-blue transition-colors">
        <Download className="w-4 h-4" />
        Baixar QR Code (PNG)
      </Button>
    </div>
  )
}
