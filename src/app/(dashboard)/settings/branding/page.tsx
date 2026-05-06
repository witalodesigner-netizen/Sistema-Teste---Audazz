"use client"

import { BrandingSettings } from "@/components/settings/BrandingSettings"
import { motion } from "framer-motion"
import { RectangleHorizontal } from "lucide-react"

export default function BrandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-audazz-blue flex items-center justify-center shadow-lg shadow-audazz-blue/20">
            <RectangleHorizontal className="text-white w-6 h-6" />
          </div>
          Identidade Visual
        </h2>
        <p className="text-muted-foreground text-lg ml-16">
          Personalize as logos horizontais do seu sistema para diferentes modos de visualização.
        </p>
      </div>

      <BrandingSettings />
    </motion.div>
  )
}
