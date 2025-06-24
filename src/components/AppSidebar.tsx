
import { Home, Search, Users, Settings, BarChart3, History, LogOut, Brain } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Find Prospects",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "All Leads",
    url: "/dashboard/leads",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <Sidebar className="bg-white border-r border-gray-100 shadow-sm">
      <SidebarHeader className="border-b border-gray-100 p-8">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
            <div className="relative z-10">
              <Brain className="h-5 w-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </div>
          <span className="text-xl font-light text-gray-900 group-hover:opacity-70 transition-opacity">
            LeadGenAI
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 data-[active=true]:bg-gray-900 data-[active=true]:text-white rounded-xl py-3 px-4 transition-all duration-200 font-medium"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-6">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 px-4 rounded-xl transition-all font-medium"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
