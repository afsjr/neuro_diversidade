"use client"

import { useEffect, useCallback } from "react"
import { getSessoesByUser, getPacientes } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface SessaoRelatorio {
  id: string
  paciente_nome: string
  data_sessao: string
  duracao: number
  tipo_profissional?: string
  status: string
  observacoes?: string
}

export function RelatorioSessoes() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sessoes, setSessoes] = useState<SessaoRelatorio[]>([])
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    paciente: "",
    status: "todos",
  })

  const [sessoesFiltradas, setSessoesFiltradas] = useState<SessaoRelatorio[]>([])

  const loadSessoes = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await getSessoesByUser(user.id)
      if (error) throw error
      
      const formatadas = (data || []).map(s => ({
        id: s.id,
        paciente_nome: s.paciente_nome,
        data_sessao: s.data_sessao,
        duracao: s.duracao,
        tipo_profissional: s.tipo_profissional,
        status: s.status,
        observacoes: s.observacoes
      }))
      
      setSessoes(formatadas)
      setSessoesFiltradas(formatadas)
    } catch (err) {
      console.error("Erro ao carregar sessões para relatório:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadSessoes()
  }, [loadSessoes])

  const aplicarFiltros = () => {
    let filtradas = sessoes

    if (filtros.dataInicio) {
      filtradas = filtradas.filter((s) => s.data_sessao >= filtros.dataInicio)
    }

    if (filtros.dataFim) {
      filtradas = filtradas.filter((s) => s.data_sessao <= filtros.dataFim)
    }

    if (filtros.paciente) {
      filtradas = filtradas.filter((s) => s.paciente_nome.toLowerCase().includes(filtros.paciente.toLowerCase()))
    }

    if (filtros.status !== "todos") {
      filtradas = filtradas.filter((s) => s.status.toLowerCase() === filtros.status)
    }

    setSessoesFiltradas(filtradas)
  }

  const totalHoras = sessoesFiltradas.reduce((acc, s) => acc + s.duracao, 0) / 60
  const mediaDuracao =
    sessoesFiltradas.length > 0 ? sessoesFiltradas.reduce((acc, s) => acc + s.duracao, 0) / sessoesFiltradas.length : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

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
                    <td className="p-2">{new Date(sessao.data_sessao).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">{sessao.duracao}min</td>
                    <td className="p-2">{sessao.tipo_profissional || "N/A"}</td>
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
