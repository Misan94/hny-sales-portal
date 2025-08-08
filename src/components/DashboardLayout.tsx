
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { MobileHeader } from "./MobileHeader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-background flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader />
          <main className="flex-1 p-3 sm:p-4 md:p-6 min-h-screen pt-16 md:pt-3">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
