import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redireciona para o login por padro no portal
  redirect('/login')
}
