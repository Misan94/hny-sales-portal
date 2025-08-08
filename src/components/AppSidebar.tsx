
import { Home, Users, ShoppingCart, Package, BarChart3, TrendingUp, AlertTriangle, Activity, User, LogOut, Target, Truck, Map } from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

const homeNavigation = [
  { title: "Home", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: Package },
]

const activityNavigation = [
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Purchases", url: "/purchases", icon: ShoppingCart },
]

const insightsNavigation = [
  { title: "Purchase Analysis", url: "/demand-analytics", icon: Activity },
  { title: "Demand Pulse", url: "/demand-pulse", icon: TrendingUp },
  { title: "Churn Analysis", url: "/churn-analysis", icon: AlertTriangle },
  { title: "Segments", url: "/segments", icon: BarChart3 },
  { title: "Promotion Insights", url: "/promotion-insights", icon: Target },
]

const forecastsNavigation = [
  { title: "Predictive Analysis", url: "/predictive-analysis", icon: TrendingUp },
  { title: "Smart Reorder Center", url: "/smart-reorder", icon: Package },
]

const planNavigation = [
  { title: "Service Tracker", url: "/service-tracker", icon: Truck },
  { title: "Growth Maps", url: "/growth-maps", icon: Map },
]

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r bg-gradient-to-b from-white to-gray-50/80" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-start">
          <img 
            src="/lovable-uploads/5fe48766-1f60-46ec-a1d8-be94fe7894b2.png" 
            alt="Honeywell Logo" 
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4 md:pt-8 h-full overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            ACTIVITY
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activityNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            INSIGHTS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {insightsNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            FORECASTS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {forecastsNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            PLAN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t mt-auto">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.role}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="flex items-center justify-start space-x-2 w-full px-2 py-3 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 touch-target"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Sign out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
