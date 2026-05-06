import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"

export default function Page({ params }: { params: { slug: string } }) {
  // Extracting the name from the path if possible, but for simplicity:
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-audazz-blue">
                  Em Desenvolvimento
                </h1>
                <p className="text-muted-foreground text-lg">
                  Este módulo está sendo preparado para sua operação de alta performance.
                </p>
              </div>
              
              <div className="grid gap-6">
                <div className="h-64 rounded-3xl border-2 border-dashed flex items-center justify-center text-muted-foreground">
                  Interface em construção...
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
