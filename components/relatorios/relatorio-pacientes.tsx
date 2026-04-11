"use client"

import { useState, useEffect, useCallback } from "react"
import { getPacientes } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Users, UserCheck, UserX, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PacienteRelatorio {
  id: string
  nome: string
  data_nascimento: string
  diagnostico?: string
  status: "ativo" | "inativo" | "alta"
  criado_em: string
}

export function RelatorioPacientes() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pacientes, setPacientes] = useState<PacienteRelatorio[]>([])

  const loadPacientes = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await getPacientes(user.id)
      if (error) throw error
      setPacientes(data || [])
    } catch (err) {
      console.error("Erro ao carregar pacientes para relatório:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadPacientes()
  }, [loadPacientes])

  const calculateAge = (dateString: string) => {
    if (!dateString) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age} anos`
  }

  const pacientesAtivos = pacientes.filter((p) => p.status === "ativo").length
  const pacientesInativos = pacientes.filter((p) => p.status === "inativo").length
  const pacientesAlta = pacientes.filter((p) => p.status === "alta").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inativo":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "alta":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{pacientes.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Pacientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{pacientesAtivos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pacientesInativos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Inativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{pacientesAlta}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes com Alta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Pacientes</CardTitle>
          <CardDescription>Informações completas sobre todos os pacientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Idade</th>
                  <th className="text-left p-2">Diagnóstico</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 font-medium">{paciente.nome}</td>
                    <td className="p-2">{calculateAge(paciente.data_nascimento)}</td>
                    <td className="p-2">{paciente.diagnostico || "Não informado"}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(paciente.status)}>{paciente.status}</Badge>
                    </td>
                    <td className="p-2">{new Date(paciente.criado_em).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
                {pacientes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">Nenhum paciente encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição por Diagnóstico */}
      {pacientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(pacientes.map((p) => p.diagnostico || "Não informado"))).map((diagnostico) => {
                const count = pacientes.filter((p) => (p.diagnostico || "Não informado") === diagnostico).length
                const percentage = (count / pacientes.length) * 100

                return (
                  <div key={diagnostico} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{diagnostico}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} pacientes ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
