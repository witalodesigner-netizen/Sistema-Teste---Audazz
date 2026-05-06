"use client"

import { useEffect } from "react"
import { getBrandingConfig } from "@/lib/actions/branding"

export function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = async () => {
      const res = await getBrandingConfig()
      if (res.success && res.data.favicon) {
        const faviconUrl = res.data.favicon;
        // Atualiza ou cria links de favicon
        ['icon', 'shortcut icon'].forEach(rel => {
          let link: HTMLLinkElement | null = document.querySelector(`link[rel="${rel}"]`)
          if (!link) {
            link = document.createElement("link")
            link.rel = rel
            document.head.appendChild(link)
          }
          // Adiciona timestamp se não for base64 para evitar cache
          const finalUrl = faviconUrl.startsWith('data:') ? faviconUrl : `${faviconUrl}?t=${Date.now()}`;
          link.href = finalUrl
        })
      }
    }

    updateFavicon()

    const channel = new BroadcastChannel("branding_sync")
    channel.onmessage = () => updateFavicon()

    return () => channel.close()
  }, [])

  return null
}
