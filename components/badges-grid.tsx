"use client"

import { Conquista } from "@/lib/supabase"
import * as Icons from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgesGridProps {
  conquistas: Conquista[]
  title?: string
}

export function BadgesGrid({ conquistas, title }: BadgesGridProps) {
  if (conquistas.length === 0) return null

  return (
    <div className="space-y-4">
      {title && <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>}
      <div className="flex flex-wrap gap-4">
        <TooltipProvider>
          {conquistas.map((conquista) => {
            const IconComponent = (Icons as any)[conquista.icone] || Icons.Award
            
            const colorClasses: Record<string, string> = {
              blue: "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
              green: "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400",
              yellow: "bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
              purple: "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
              orange: "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
            }

            const colorClass = colorClasses[conquista.cor_base] || colorClasses.blue

            return (
              <Tooltip key={conquista.id}>
                <TooltipTrigger asChild>
                  <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 ${colorClass} transition-transform hover:scale-110 cursor-help shadow-sm`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-3 max-w-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">{conquista.titulo}</p>
                    <p className="text-xs text-gray-500">{conquista.descricao}</p>
                    {conquista.data_conquista && (
                      <p className="text-[10px] text-gray-400 pt-1">
                        Alcançado em: {new Date(conquista.data_conquista).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
