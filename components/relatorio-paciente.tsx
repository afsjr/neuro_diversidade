"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User, Activity, TrendingUp } from "lucide-react"
import { getPacienteById, getSessoesByPaciente, type Paciente, type Sessao } from "@/lib/supabase"
import { calculateAge, formatDate } from "@/lib/utils"

interface RelatorioPacienteProps {
  pacienteId: string
}

interface AreaStats {
  nivel_medio: number
  ultima_avaliacao: string
  tendencia: "melhorando" | "estavel" | "piorando"
}

interface RelatorioData {
  paciente: Paciente
  sessoes: Sessao[]
  areas: {
    comportamental: AreaStats
    emocional: AreaStats
    motora: AreaStats
    cognitiva: AreaStats
    comunicacao: AreaStats
  }
  resumo: {
    total_sessoes: number
    periodo: string
    profissionais: string[]
    medicacoes: string[]
  }
}

export function RelatorioPaciente({ pacienteId }: RelatorioPacienteProps) {
  const [relatorio, setRelatorio] = useState<RelatorioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelatorio()
  }, [pacienteId])

  const loadRelatorio = async () => {
    try {
      setLoading(true)

      // Buscar dados do paciente
      const { data: paciente } = await getPacienteById(pacienteId)
      const { data: sessoes } = await getSessoesByPaciente(pacienteId)

      if (!paciente || !sessoes) return

      // Processar dados das áreas de desenvolvimento
      const areas = processarAreas(sessoes)
      const resumo = processarResumo(sessoes)

      setRelatorio({
        paciente,
        sessoes,
        areas,
        resumo,
      })
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
    } finally {
      setLoading(false)
    }
  }

  const processarAreas = (sessoes: Sessao[]) => {
    // Extrair dados das áreas das observações estruturadas
    const areas = {
      comportamental: { nivel_medio: 3, ultima_avaliacao: "", tendencia: "estavel" as const },
      emocional: { nivel_medio: 3, ultima_avaliacao: "", tendencia: "estavel" as const },
      motora: { nivel_medio: 3, ultima_avaliacao: "", tendencia: "estavel" as const },
      cognitiva: { nivel_medio: 3, ultima_avaliacao: "", tendencia: "estavel" as const },
      comunicacao: { nivel_medio: 3, ultima_avaliacao: "", tendencia: "estavel" as const },
    }

    // Processar sessões para extrair níveis das áreas
    const sessoesComAreas = sessoes
      .filter((s) => s.observacoes?.includes("=== ÁREAS DE DESENVOLVIMENTO ==="))
      .sort((a, b) => new Date(b.data_sessao).getTime() - new Date(a.data_sessao).getTime())

    if (sessoesComAreas.length > 0) {
      const ultimaSessao = sessoesComAreas[0]
      areas.comportamental.ultima_avaliacao = formatDate(ultimaSessao.data_sessao)
      areas.emocional.ultima_avaliacao = formatDate(ultimaSessao.data_sessao)
      areas.motora.ultima_avaliacao = formatDate(ultimaSessao.data_sessao)
      areas.cognitiva.ultima_avaliacao = formatDate(ultimaSessao.data_sessao)
      areas.comunicacao.ultima_avaliacao = formatDate(ultimaSessao.data_sessao)

      // Extrair níveis da última sessão
      const observacoes = ultimaSessao.observacoes || ""
      const comportamentalMatch = observacoes.match(/COMPORTAMENTAL $$Nível (\d)\/5$$/)
      const emocionalMatch = observacoes.match(/EMOCIONAL $$Nível (\d)\/5$$/)
      const motoraMatch = observacoes.match(/MOTORA $$Nível (\d)\/5$$/)
      const cognitivaMatch = observacoes.match(/COGNITIVA $$Nível (\d)\/5$$/)
      const comunicacaoMatch = observacoes.match(/COMUNICAÇÃO $$Nível (\d)\/5$$/)

      if (comportamentalMatch) areas.comportamental.nivel_medio = Number.parseInt(comportamentalMatch[1])
      if (emocionalMatch) areas.emocional.nivel_medio = Number.parseInt(emocionalMatch[1])
      if (motoraMatch) areas.motora.nivel_medio = Number.parseInt(motoraMatch[1])
      if (cognitivaMatch) areas.cognitiva.nivel_medio = Number.parseInt(cognitivaMatch[1])
      if (comunicacaoMatch) areas.comunicacao.nivel_medio = Number.parseInt(comunicacaoMatch[1])
    }

    return areas
  }

  const processarResumo = (sessoes: Sessao[]) => {
    const profissionais = new Set<string>()
    const medicacoes = new Set<string>()

    sessoes.forEach((sessao) => {
      if (sessao.observacoes) {
        const profissionalMatch = sessao.observacoes.match(/PROFISSIONAL: (.+)/)
        if (profissionalMatch) {
          profissionais.add(profissionalMatch[1])
        }

        const medicacaoMatch = sessao.observacoes.match(/MEDICAÇÃO: (.+)/)
        if (medicacaoMatch) {
          medicacoes.add(medicacaoMatch[1])
        }
      }
    })

    const datasOrdenadas = sessoes.map((s) => new Date(s.data_sessao)).sort((a, b) => a.getTime() - b.getTime())

    const periodo =
      datasOrdenadas.length > 0
        ? `${formatDate(datasOrdenadas[0].toISOString())} - ${formatDate(
            datasOrdenadas[datasOrdenadas.length - 1].toISOString(),
          )}`
        : "Sem dados"

    return {
      total_sessoes: sessoes.length,
      periodo,
      profissionais: Array.from(profissionais),
      medicacoes: Array.from(medicacoes),
    }
  }

  const getNivelColor = (nivel: number) => {
    if (nivel <= 2) return "text-red-600 bg-red-100"
    if (nivel === 3) return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  const exportarRelatorio = () => {
    if (!relatorio) return

    const conteudo = `
RELATÓRIO DE DESENVOLVIMENTO - ${relatorio.paciente.nome.toUpperCase()}

=== INFORMAÇÕES PESSOAIS ===
Nome: ${relatorio.paciente.nome}
Idade: ${calculateAge(relatorio.paciente.data_nascimento)} anos
Data de Nascimento: ${formatDate(relatorio.paciente.data_nascimento)}
Responsável: ${relatorio.paciente.responsavel}
Diagnóstico: ${relatorio.paciente.diagnostico || "Não informado"}
Status: ${relatorio.paciente.status}

=== RESUMO DO ATENDIMENTO ===
Total de Sessões: ${relatorio.resumo.total_sessoes}
Período: ${relatorio.resumo.periodo}
Profissionais Envolvidos: ${relatorio.resumo.profissionais.join(", ") || "Não informado"}
Medicações: ${relatorio.resumo.medicacoes.join(", ") || "Nenhuma"}

=== ÁREAS DE DESENVOLVIMENTO ===

COMPORTAMENTAL:
- Nível Atual: ${relatorio.areas.comportamental.nivel_medio}/5
- Última Avaliação: ${relatorio.areas.comportamental.ultima_avaliacao}

EMOCIONAL:
- Nível Atual: ${relatorio.areas.emocional.nivel_medio}/5
- Última Avaliação: ${relatorio.areas.emocional.ultima_avaliacao}

MOTORA:
- Nível Atual: ${relatorio.areas.motora.nivel_medio}/5
- Última Avaliação: ${relatorio.areas.motora.ultima_avaliacao}

COGNITIVA:
- Nível Atual: ${relatorio.areas.cognitiva.nivel_medio}/5
- Última Avaliação: ${relatorio.areas.cognitiva.ultima_avaliacao}

COMUNICAÇÃO:
- Nível Atual: ${relatorio.areas.comunicacao.nivel_medio}/5
- Última Avaliação: ${relatorio.areas.comunicacao.ultima_avaliacao}

=== HISTÓRICO DE SESSÕES ===
${relatorio.sessoes
  .sort((a, b) => new Date(b.data_sessao).getTime() - new Date(a.data_sessao).getTime())
  .map(
    (sessao) => `
Data: ${formatDate(sessao.data_sessao)}
Duração: ${sessao.duracao} minutos
Status: ${sessao.status}
Objetivos: ${sessao.objetivos}
Resultados: ${sessao.resultados}
Observações: ${sessao.observacoes}
---
`,
  )
  .join("")}

Relatório gerado em: ${new Date().toLocaleString("pt-BR")}
    `.trim()

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio_${relatorio.paciente.nome.replace(/\s+/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!relatorio) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Não foi possível carregar o relatório</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Relatório de Desenvolvimento
          </h2>
          <p className="text-gray-600">Consolidação dos dados de atendimento</p>
        </div>
        <Button onClick={exportarRelatorio}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Informações do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Nome:</strong> {relatorio.paciente.nome}
              </p>
              <p>
                <strong>Idade:</strong> {calculateAge(relatorio.paciente.data_nascimento)} anos
              </p>
              <p>
                <strong>Responsável:</strong> {relatorio.paciente.responsavel}
              </p>
            </div>
            <div>
              <p>
                <strong>Diagnóstico:</strong> {relatorio.paciente.diagnostico || "Não informado"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge variant={relatorio.paciente.status === "ativo" ? "default" : "secondary"}>
                  {relatorio.paciente.status}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Atendimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Resumo do Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Total de Sessões:</strong> {relatorio.resumo.total_sessoes}
              </p>
              <p>
                <strong>Período:</strong> {relatorio.resumo.periodo}
              </p>
            </div>
            <div>
              <p>
                <strong>Profissionais:</strong> {relatorio.resumo.profissionais.join(", ") || "Não informado"}
              </p>
              <p>
                <strong>Medicações:</strong> {relatorio.resumo.medicacoes.join(", ") || "Nenhuma"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Desenvolvimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Áreas de Desenvolvimento
          </CardTitle>
          <CardDescription>Status atual em cada área avaliada (escala 1-5)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(relatorio.areas).map(([area, dados]) => (
              <div key={area} className="p-4 border rounded-lg">
                <h4 className="font-semibold capitalize mb-2">{area.replace("_", " ")}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Nível:</span>
                    <Badge className={getNivelColor(dados.nivel_medio)}>{dados.nivel_medio}/5</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {dados.ultima_avaliacao || "Sem avaliação"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico Resumido */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatorio.sessoes
              .sort((a, b) => new Date(b.data_sessao).getTime() - new Date(a.data_sessao).getTime())
              .slice(0, 5)
              .map((sessao) => (
                <div key={sessao.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{formatDate(sessao.data_sessao)}</h5>
                    <Badge variant={sessao.status === "realizada" ? "default" : "secondary"}>{sessao.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Objetivos:</strong> {sessao.objetivos}
                  </p>
                  {sessao.resultados && (
                    <p className="text-sm text-gray-600">
                      <strong>Resultados:</strong> {sessao.resultados}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
