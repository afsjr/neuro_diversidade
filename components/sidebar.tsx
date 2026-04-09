"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Users,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Pacientes", href: "/dashboard/pacientes", icon: Users },
  { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { name: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
  { name: "Análises", href: "/dashboard/analises", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
  { name: "Teste Conexão", href: "/dashboard/teste-conexao", icon: Database },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">NeuroAcompanha</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                    active
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn("h-5 w-5", !collapsed && "mr-3", active && "text-blue-600 dark:text-blue-400")}
                  />
                  {!collapsed && (
                    <span className={cn("transition-colors", active && "font-semibold")}>{item.name}</span>
                  )}
                  {active && !collapsed && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">NeuroAcompanha Pro v1.0</div>
        </div>
      )}
    </div>
  )
}
