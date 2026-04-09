"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

interface PacienteRelatorio {
  id: string
  nome: string
  idade: number
  diagnostico: string
  status: "ativo" | "inativo" | "alta"
  totalSessoes: number
  ultimaSessao: string
  progresso: number
}

const pacientesExemplo: PacienteRelatorio[] = [
  {
    id: "1",
    nome: "Ana Silva",
    idade: 9,
    diagnostico: "TEA",
    status: "ativo",
    totalSessoes: 15,
    ultimaSessao: "2024-01-15",
    progresso: 85,
  },
  {
    id: "2",
    nome: "João Santos",
    idade: 12,
    diagnostico: "TDAH",
    status: "ativo",
    totalSessoes: 8,
    ultimaSessao: "2024-01-14",
    progresso: 70,
  },
  {
    id: "3",
    nome: "Beatriz Costa",
    idade: 6,
    diagnostico: "Atraso no Desenvolvimento",
    status: "ativo",
    totalSessoes: 12,
    ultimaSessao: "2024-01-13",
    progresso: 90,
  },
]

export function RelatorioPacientes() {
  const pacientesAtivos = pacientesExemplo.filter((p) => p.status === "ativo").length
  const pacientesInativos = pacientesExemplo.filter((p) => p.status === "inativo").length
  const pacientesAlta = pacientesExemplo.filter((p) => p.status === "alta").length
  const progressoMedio = pacientesExemplo.reduce((acc, p) => acc + p.progresso, 0) / pacientesExemplo.length

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

  const getProgressoColor = (progresso: number) => {
    if (progresso >= 80) return "text-green-600"
    if (progresso >= 60) return "text-yellow-600"
    return "text-red-600"
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
                <div className="text-2xl font-bold text-blue-600">{pacientesExemplo.length}</div>
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
                <div className="text-2xl font-bold text-purple-600">{progressoMedio.toFixed(0)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Progresso Médio</div>
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
                  <th className="text-left p-2">Sessões</th>
                  <th className="text-left p-2">Última Sessão</th>
                  <th className="text-left p-2">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {pacientesExemplo.map((paciente) => (
                  <tr key={paciente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 font-medium">{paciente.nome}</td>
                    <td className="p-2">{paciente.idade} anos</td>
                    <td className="p-2">{paciente.diagnostico}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(paciente.status)}>{paciente.status}</Badge>
                    </td>
                    <td className="p-2">{paciente.totalSessoes}</td>
                    <td className="p-2">{new Date(paciente.ultimaSessao).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">
                      <span className={`font-semibold ${getProgressoColor(paciente.progresso)}`}>
                        {paciente.progresso}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição por Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(pacientesExemplo.map((p) => p.diagnostico))).map((diagnostico) => {
              const count = pacientesExemplo.filter((p) => p.diagnostico === diagnostico).length
              const percentage = (count / pacientesExemplo.length) * 100

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
    </div>
  )
}
