import { Calendar, Home, Inbox, Plus, Search, Settings, FileText, Minus, Pencil } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom";
import { usePagesContext } from "@/contexts/PagesContext"; // Added

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]


export default function AppSidebar() {
  const navigate = useNavigate();
  const { 
    pages, 
    isLoadingPages, 
    handleDeletePage,
  } = usePagesContext(); // Changed to usePagesContext

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>          
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupAction className="w-2 h-5" onClick={() => {
            navigate("/new-page");
          }}>
            <Plus />
        </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoadingPages && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span>Loading pages...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {!isLoadingPages && pages.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span>No pages yet.</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {!isLoadingPages &&
                pages.map((page) => (
                  <SidebarMenuItem key={page.id}>
                    <SidebarMenuButton asChild>
                      <Link to={`/page/${page.id}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        <span>Page {page.id}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction onClick={async () => {
                      try {
                        await handleDeletePage(page.id);
                        navigate("/home");
                      } catch (error) {
                        // Error is already handled by toast in handleDeletePage in the context
                        // Additional UI-specific error handling could go here if needed
                        console.error(`UI: Error after attempting to delete page ${page.id} directly in AppSidebar:`, error);
                      }
                    }}>
                      <Minus className="w-2 h-2" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
