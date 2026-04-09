"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Calendar } from "lucide-react"
import { SessaoForm } from "@/components/forms/sessao-form"
import { SessaoCard } from "@/components/sessao-card"
import { useToast } from "@/hooks/use-toast"
import { getSessoesByPaciente, createSessao, updateSessao, deleteSessao, type Sessao } from "@/lib/supabase"

interface SessoesTabProps {
  pacienteId: string
}

export function SessoesTab({ pacienteId }: SessoesTabProps) {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null)
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    loadSessoes()
  }, [pacienteId])

  const loadSessoes = async () => {
    try {
      setLoading(true)
      const { data, error } = await getSessoesByPaciente(pacienteId)

      if (error) {
        throw new Error(error.message)
      }

      setSessoes(data || [])
    } catch (error: any) {
      console.error("Erro ao carregar sessões:", error)
      toast({
        title: "Erro ao carregar sessões",
        description: error.message || "Não foi possível carregar as sessões do paciente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSessao = async (novaSessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => {
    try {
      const { data, error } = await createSessao(novaSessao)

      if (error) {
        throw new Error(error.message)
      }

      if (data) {
        setSessoes((prev) => [data, ...prev])
        setShowForm(false)
        setEditingSessao(null)
        toast({
          title: "Sessão criada",
          description: "Sessão registrada com sucesso",
        })
      }
    } catch (error: any) {
      console.error("Erro ao salvar sessão:", error)
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a sessão",
        variant: "destructive",
      })
    }
  }

  const handleEditSessao = (sessao: Sessao) => {
    setEditingSessao(sessao)
    setShowForm(true)
  }

  const handleUpdateSessao = async (sessaoAtualizada: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => {
    if (!editingSessao) return

    try {
      const { data, error } = await updateSessao(editingSessao.id, sessaoAtualizada)

      if (error) {
        throw new Error(error.message)
      }

      if (data) {
        setSessoes((prev) => prev.map((s) => (s.id === editingSessao.id ? data : s)))
        setShowForm(false)
        setEditingSessao(null)
        toast({
          title: "Sessão atualizada",
          description: "Sessão atualizada com sucesso",
        })
      }
    } catch (error: any) {
      console.error("Erro ao atualizar sessão:", error)
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a sessão",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSessao = async (sessaoId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta sessão?")) return

    try {
      const { error } = await deleteSessao(sessaoId)

      if (error) {
        throw new Error(error.message)
      }

      setSessoes((prev) => prev.filter((s) => s.id !== sessaoId))
      toast({
        title: "Sessão excluída",
        description: "A sessão foi excluída com sucesso",
      })
    } catch (error: any) {
      console.error("Erro ao excluir sessão:", error)
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir a sessão",
        variant: "destructive",
      })
    }
  }

  const filteredSessoes = sessoes
    .filter((sessao) => {
      const matchesSearch =
        searchTerm === "" ||
        sessao.objetivos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sessao.observacoes?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || sessao.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.data_sessao).getTime()
      const dateB = new Date(b.data_sessao).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const getStatusStats = () => {
    const realizadas = sessoes.filter((s) => s.status === "realizada").length
    const agendadas = sessoes.filter((s) => s.status === "agendada").length
    const canceladas = sessoes.filter((s) => s.status === "cancelada").length

    return { realizadas, agendadas, canceladas, total: sessoes.length }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Sessões de Terapia</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Registre e acompanhe as sessões realizadas com o paciente
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingSessao(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Sessão
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.realizadas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Realizadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.agendadas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.canceladas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Canceladas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por objetivos ou observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="agendada">Agendadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mais Recentes</SelectItem>
                  <SelectItem value="asc">Mais Antigas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSessao ? "Editar Sessão" : "Registrar Nova Sessão"}</CardTitle>
            <CardDescription>
              {editingSessao
                ? "Atualize as informações da sessão"
                : "Preencha os detalhes da sessão realizada ou agendada"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessaoForm
              pacienteId={pacienteId}
              onSubmit={editingSessao ? handleUpdateSessao : handleAddSessao}
              onCancel={() => {
                setShowForm(false)
                setEditingSessao(null)
              }}
              editingSessao={editingSessao}
            />
          </CardContent>
        </Card>
      )}

      {/* Lista de Sessões */}
      <div className="space-y-4">
        {filteredSessoes.length > 0 ? (
          filteredSessoes.map((sessao) => (
            <SessaoCard key={sessao.id} sessao={sessao} onEdit={handleEditSessao} onDelete={handleDeleteSessao} />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "todos"
                  ? "Nenhuma sessão encontrada com os filtros aplicados"
                  : "Nenhuma sessão registrada ainda"}
              </p>
              {!searchTerm && statusFilter === "todos" && (
                <Button variant="outline" onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Primeira Sessão
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
