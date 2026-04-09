"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, TrendingUp } from "lucide-react"

interface SessaoRelatorio {
  id: string
  paciente_nome: string
  data: string
  duracao: number
  tipo: string
  status: string
  observacoes: string
}

const sessoesExemplo: SessaoRelatorio[] = [
  {
    id: "1",
    paciente_nome: "Ana Silva",
    data: "2024-01-15",
    duracao: 60,
    tipo: "Terapia Comportamental",
    status: "Realizada",
    observacoes: "Boa participação, progresso visível",
  },
  {
    id: "2",
    paciente_nome: "João Santos",
    data: "2024-01-14",
    duracao: 45,
    tipo: "Consulta",
    status: "Realizada",
    observacoes: "Acompanhamento de rotina",
  },
  {
    id: "3",
    paciente_nome: "Beatriz Costa",
    data: "2024-01-13",
    duracao: 90,
    tipo: "Avaliação",
    status: "Realizada",
    observacoes: "Avaliação neuropsicológica completa",
  },
]

export function RelatorioSessoes() {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    paciente: "",
    status: "todos",
  })

  const [sessoesFiltradas, setSessoesFiltradas] = useState(sessoesExemplo)

  const aplicarFiltros = () => {
    let sessoes = sessoesExemplo

    if (filtros.dataInicio) {
      sessoes = sessoes.filter((s) => s.data >= filtros.dataInicio)
    }

    if (filtros.dataFim) {
      sessoes = sessoes.filter((s) => s.data <= filtros.dataFim)
    }

    if (filtros.paciente) {
      sessoes = sessoes.filter((s) => s.paciente_nome.toLowerCase().includes(filtros.paciente.toLowerCase()))
    }

    if (filtros.status !== "todos") {
      sessoes = sessoes.filter((s) => s.status.toLowerCase() === filtros.status)
    }

    setSessoesFiltradas(sessoes)
  }

  const totalHoras = sessoesFiltradas.reduce((acc, s) => acc + s.duracao, 0) / 60
  const mediaDuracao =
    sessoesFiltradas.length > 0 ? sessoesFiltradas.reduce((acc, s) => acc + s.duracao, 0) / sessoesFiltradas.length : 0

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Configure os filtros para gerar o relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paciente">Paciente</Label>
              <Input
                id="paciente"
                placeholder="Nome do paciente"
                value={filtros.paciente}
                onChange={(e) => setFiltros({ ...filtros, paciente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={aplicarFiltros}>Aplicar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{sessoesFiltradas.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Sessões</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{totalHoras.toFixed(1)}h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{mediaDuracao.toFixed(0)}min</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duração Média</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Sessões */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Paciente</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Duração</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Observações</th>
                </tr>
              </thead>
              <tbody>
                {sessoesFiltradas.map((sessao) => (
                  <tr key={sessao.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">{sessao.paciente_nome}</td>
                    <td className="p-2">{new Date(sessao.data).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">{sessao.duracao}min</td>
                    <td className="p-2">{sessao.tipo}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {sessao.status}
                      </span>
                    </td>
                    <td className="p-2 max-w-xs truncate">{sessao.observacoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
