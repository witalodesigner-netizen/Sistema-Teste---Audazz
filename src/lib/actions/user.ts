"use server"

import fs from 'fs/promises'
import path from 'path'
import { unstable_noStore as noStore } from 'next/cache'

const DATA_PATH = path.join(process.cwd(), 'src/data/user-profile.json')

export async function getUserProfile() {
  noStore()
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {
      firstName: "Usuário",
      lastName: "Audazz",
      email: "admin@audazz.studio",
      whatsapp: "",
      avatar: null
    }
  }
}

export async function saveUserProfile(profileData: any) {
  try {
    console.log('--- Iniciando salvamento de perfil ---')
    
    // Validar dados básicos
    if (!profileData) {
      return { success: false, error: 'Dados inválidos.' }
    }

    // Garantir que o diretório exista
    const dir = path.dirname(DATA_PATH)
    console.log('Diretório de dados:', dir)
    
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (e) {
      console.log('Diretório já existe ou erro ao criar:', e)
    }

    // Tentar gravar o arquivo
    const content = JSON.stringify(profileData, null, 2)
    console.log('Tamanho do payload:', (content.length / 1024).toFixed(2), 'KB')
    
    await fs.writeFile(DATA_PATH, content, 'utf-8')
    
    console.log('Perfil salvo com sucesso em:', DATA_PATH)
    return { success: true }
  } catch (error: any) {
    console.error('ERRO CRÍTICO NO SERVIDOR:', error)
    return { 
      success: false, 
      error: error.message || 'Erro interno no servidor ao gravar arquivo.' 
    }
  }
}
