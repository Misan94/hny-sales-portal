
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function MobileHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-background border-b md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  )
}
