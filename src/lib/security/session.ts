import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export async function getPortalSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('portal-token')?.value
  
  if (!token) return null
  
  try {
    const decoded = await adminAuth.verifyIdToken(token)
    return decoded
  } catch (error) {
    return null
  }
}
