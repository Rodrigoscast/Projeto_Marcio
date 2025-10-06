import { Calendar, Home, Truck, Package, 
      } from "lucide-react"
 
import { FcOnlineSupport, FcNews, FcHome } from "react-icons/fc";
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"

export function AppSidebar({ permissoes }) {
  const { state } = useSidebar()
  const pathname = usePathname()

  // Menu principal
  const items = [
    {
      title: "Inicio",
      url: "/inicio",
      icon: FcHome,
    },
    {
      title: "Suporte de IA",
      url: "/suporte",
      icon: FcOnlineSupport,
    },
    {
      title: "Detector de Fake News",
      url: "/fake-news",
      icon: FcNews,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div
          className={cn(
            "relative flex justify-center items-center h-20 w-full transition-all duration-300 ease-in-out",
            state === "collapsed" ? "" : "my-4"
          )}
        >
          <img
            src="/icone.png"
            alt="Logo expandido"
            className={cn(
              "h-20 w-20 absolute transition-all duration-300 ease-in-out dark:hidden",
              state === "collapsed"
                ? "opacity-0 scale-90 translate-y-2"
                : "opacity-100 scale-100 translate-y-0"
            )}
          />
          <img
            src="/icone-light.png"
            alt="Logo expandido"
            className={cn(
              "h-20 w-20 absolute transition-all duration-300 ease-in-out hidden dark:block",
              state === "collapsed"
                ? "opacity-0 scale-90 translate-y-2"
                : "opacity-100 scale-100 translate-y-0"
            )}
          />
          <img
            src="/icone.png"
            alt="Logo colapsado"
            className={cn(
              "h-8 w-8 absolute transition-all duration-300 ease-in-out",
              state === "collapsed"
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 -translate-y-2"
            )}
          />
        </div>

        <ScrollArea className="py-4 max-h-[calc(100vh-100px)]">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                {/* Itens principais */}
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-3 w-50 py-6 ${item.url == pathname ? 'bg-card dark:bg-input shadow-md' : ''}`}
                      >
                        <item.icon className={cn("!size-6",
                          state === "collapsed"
                            ? "-translate-x-1"
                            : ""
                        )} />
                        <span className="text-base font-normal">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}                
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
