"use client"

import React, { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Thermometer, MapPin } from "lucide-react"

export function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: React.ReactNode;
    city: string;
  } | null>(null)

  useEffect(() => {
    const getWeatherIcon = (code: number) => {
      if (code === 0) return <Sun className="w-4 h-4 text-orange-400 animate-pulse" />
      if (code <= 3) return <Cloud className="w-4 h-4 text-audazz-blue" />
      if (code <= 67) return <CloudRain className="w-4 h-4 text-blue-400" />
      if (code <= 77) return <Snowflake className="w-4 h-4 text-cyan-200" />
      if (code <= 82) return <CloudRain className="w-4 h-4 text-blue-600" />
      if (code <= 99) return <CloudLightning className="w-4 h-4 text-yellow-400" />
      return <Cloud className="w-4 h-4 text-muted-foreground" />
    }

    const translateCondition = (code: number) => {
      if (code === 0) return "Céu Limpo"
      if (code <= 3) return "Parcialmente Nublado"
      if (code <= 48) return "Nevoeiro"
      if (code <= 67) return "Chuva Leve"
      if (code <= 82) return "Chuva Forte"
      if (code <= 99) return "Tempestade"
      return "Nublado"
    }

    const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
      try {
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        const weatherData = await weatherRes.json()
        const current = weatherData.current_weather

        let finalCity = cityName
        if (!finalCity) {
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`)
          const geoData = await geoRes.json()
          finalCity = geoData.city || geoData.principalSubdivisionCode?.replace("BR-", "") || "Brasil"
        }

        setWeather({
          temp: Math.round(current.temperature),
          condition: translateCondition(current.weathercode),
          icon: getWeatherIcon(current.weathercode),
          city: finalCity.toUpperCase()
        })
      } catch (error) {
        console.error("Erro ao buscar clima", error)
      }
    }

    // Tenta pegar localização real
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => {
          // Fallback por IP (São Paulo como default ou via IP-API)
          fetchWeather(-23.5505, -46.6333, "SP")
        }
      )
    } else {
      fetchWeather(-23.5505, -46.6333, "SP")
    }
  }, [])

  if (!weather) return null

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 backdrop-blur-xl border border-white/5 hover:border-audazz-blue/30 transition-all cursor-default group shadow-sm">
      <div className="flex items-center gap-2">
        {weather.icon}
        <span className="text-sm font-bold text-foreground whitespace-nowrap">
          {weather.temp}°C
        </span>
      </div>
      
      <span className="text-muted-foreground/50 font-bold">•</span>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {weather.condition}
        </span>
        <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/10">
          <MapPin className="w-3 h-3 text-muted-foreground group-hover:text-audazz-blue transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {weather.city}
          </span>
        </div>
      </div>
    </div>
  )
}
