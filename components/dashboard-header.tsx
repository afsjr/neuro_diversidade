"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral dos seus pacientes e atividades</p>
      </div>
      <Button onClick={() => (window.location.href = "/dashboard/pacientes/novo")}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Paciente
      </Button>
    </div>
  )
}
