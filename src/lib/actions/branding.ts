"use server"

import fs from "fs"
import path from "path"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"

const CONFIG_PATH = path.join(process.cwd(), "src/data/branding.json")

export async function saveBrandingConfig(data: { 
  darkLogo: string, 
  lightLogo: string, 
  systemName: string, 
  slogan: string,
  favicon: string 
}) {
  try {
    const dir = path.dirname(CONFIG_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))

    revalidatePath("/", "layout")
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBrandingConfig() {
  noStore();
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return { 
        success: true, 
        data: { 
          lightLogo: "", 
          darkLogo: "", 
          systemName: "Audazz Nexus OS", 
          slogan: "Gestão de Alta Performance",
          favicon: "" 
        } 
      };
    }
    
    const content = fs.readFileSync(CONFIG_PATH, "utf-8")
    const config = JSON.parse(content)
    
    return { 
      success: true, 
      data: {
        lightLogo: config.lightLogo || "",
        darkLogo: config.darkLogo || "",
        systemName: config.systemName || "Audazz Nexus OS",
        slogan: config.slogan || "Gestão de Alta Performance",
        favicon: config.favicon || ""
      } 
    };
  } catch (error: any) {
    return { 
      success: false, 
      data: { 
        lightLogo: "", 
        darkLogo: "", 
        systemName: "Audazz Nexus OS", 
        slogan: "Gestão de Alta Performance",
        favicon: "" 
      } 
    };
  }
}
