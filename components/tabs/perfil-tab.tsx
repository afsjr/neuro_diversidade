"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPacienteById, getConquistasPaciente, type Paciente, type Conquista } from "@/lib/supabase"
import { calculateAge } from "@/lib/utils"
import { BadgesGrid } from "@/components/badges-grid"
import { Loader2 } from "lucide-react"

interface PerfilTabProps {
  pacienteId: string
}

export function PerfilTab({ pacienteId }: PerfilTabProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [conquistas, setConquistas] = useState<Conquista[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [pacienteRes, conquistasRes] = await Promise.all([
        getPacienteById(pacienteId),
        getConquistasPaciente(pacienteId)
      ])
      
      if (pacienteRes.data) setPaciente(pacienteRes.data)
      setConquistas(conquistasRes.data || [])
      setLoading(false)
    }
    loadData()
  }, [pacienteId])

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados básicos do paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
              <p className="text-gray-900 dark:text-white">{paciente?.nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
              <p className="text-gray-900 dark:text-white">
                {paciente?.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString("pt-BR") : "Não informada"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idade</label>
              <p className="text-gray-900 dark:text-white">
                {paciente?.data_nascimento ? `${calculateAge(paciente.data_nascimento)} anos` : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Responsável</CardTitle>
            <CardDescription>Dados de contato do responsável</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Responsável</label>
              <p className="text-gray-900 dark:text-white">{paciente?.responsavel}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
              <p className="text-gray-900 dark:text-white">{paciente?.telefone || "Não informado"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="text-gray-900 dark:text-white">{paciente?.email || "Não informado"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Clínicas</CardTitle>
            <CardDescription>Diagnóstico e observações médicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnóstico Principal</label>
              <p className="text-gray-900 dark:text-white">{paciente?.diagnostico || "Não informado"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Escolares</CardTitle>
            <CardDescription>Escola e série do estudante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Escola / Colégio</label>
              <p className="text-gray-900 dark:text-white">{paciente?.escola || "Não informado"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Série / Ano</label>
              <p className="text-gray-900 dark:text-white">{paciente?.serie || "Não informado"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conquistas e Badges</CardTitle>
            <CardDescription>Jornada de evolução e superação</CardDescription>
          </CardHeader>
          <CardContent>
            <BadgesGrid conquistas={conquistas} />
            {conquistas.length === 0 && (
              <p className="text-sm text-gray-500 italic py-2">
                Nenhuma conquista alcançada ainda. Continue a jornada!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
