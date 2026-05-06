"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Palette, Download, Copy, Eye, Image as ImageIcon, Type, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const colors = [
  { name: "Audazz Blue", hex: "#0071E3", use: "Primária / Botões" },
  { name: "Pure White", hex: "#FFFFFF", use: "Background / Texto" },
  { name: "Deep Black", hex: "#1D1D1F", use: "Tipografia / Ícones" },
  { name: "System Gray", hex: "#F5F5F7", use: "Cards / Divisores" },
]

const assets = [
  { name: "Logo Vertical", format: "SVG / PNG", type: "Visual" },
  { name: "Logo Horizontal", format: "SVG / PNG", type: "Visual" },
  { name: "Ícones Custom", format: "Font / SVG", type: "Interface" },
  { name: "Social Media Kits", format: "PSD / FIG", type: "Marketing" },
]

export default function BrandBookPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Brand Book" 
        description="Diretrizes visuais e ativos da marca Audazz Studio"
        icon={Palette}
        actions={
          <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2">
            <Download className="w-4 h-4" /> Baixar Manual (.PDF)
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Palette className="w-5 h-5 text-audazz-blue" /> Paleta de Cores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.map((color, i) => (
              <motion.div
                key={color.hex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none bg-secondary/10 overflow-hidden group">
                  <div className="h-24 transition-transform group-hover:scale-105" style={{ backgroundColor: color.hex }} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{color.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">{color.hex}</p>
                    <p className="text-[10px] font-bold text-audazz-blue mt-2 uppercase tracking-widest">{color.use}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Type className="w-5 h-5 text-audazz-blue" /> Tipografia
          </h3>
          <Card className="border-none bg-secondary/10 p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Fonte Primária</p>
              <h4 className="text-4xl font-black font-sans">Poppins</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilizada para cabeçalhos, títulos e elementos de destaque. Transmite modernidade, clareza e autoridade técnica.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              {['Light', 'Regular', 'SemiBold', 'Black'].map(w => (
                <div key={w} className="flex flex-col items-center gap-1">
                  <span className="text-2xl" style={{ fontWeight: w === 'Black' ? 900 : w === 'SemiBold' ? 600 : w === 'Regular' ? 400 : 300 }}>Aa</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{w}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-audazz-blue" /> Ativos de Marca
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset, i) => (
            <motion.div
              key={asset.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none bg-secondary/10 hover:bg-secondary/20 transition-all group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-audazz-blue">
                    <Square className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{asset.name}</h4>
                    <p className="text-xs text-muted-foreground">{asset.format}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="secondary" size="sm" className="flex-1 rounded-full text-[10px] font-bold h-8">
                      <Eye className="w-3 h-3 mr-1" /> VER
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 rounded-full text-[10px] font-bold h-8">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
