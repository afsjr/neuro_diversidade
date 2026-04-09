"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Target, Brain, Heart, Zap, MessageCircle, Activity } from "lucide-react"
import type { Sessao } from "@/lib/supabase"

interface SessaoFormProps {
  pacienteId: string
  onSubmit: (sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) => void
  onCancel: () => void
  editingSessao?: Sessao | null
}

interface FormErrors {
  data_sessao?: string
  duracao?: string
  objetivos?: string
  observacoes?: string
}

interface AreasDesenvolvimento {
  comportamental: {
    observacoes: string
    nivel: string // 1-5 escala
    agitacao: string
    rigidez: string
  }
  emocional: {
    observacoes: string
    nivel: string
    estado_humor: string
    regulacao: string
  }
  motora: {
    observacoes: string
    nivel: string
    coordenacao_fina: string
    coordenacao_grossa: string
  }
  cognitiva: {
    observacoes: string
    nivel: string
    atencao: string
    memoria: string
    raciocinio: string
  }
  comunicacao: {
    observacoes: string
    nivel: string
    verbal: string
    nao_verbal: string
    compreensao: string
  }
}

export function SessaoForm({ pacienteId, onSubmit, onCancel, editingSessao }: SessaoFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    data_sessao: editingSessao
      ? new Date(editingSessao.data_sessao).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    duracao: editingSessao?.duracao?.toString() || "60",
    observacoes: editingSessao?.observacoes || "",
    objetivos: editingSessao?.objetivos || "",
    resultados: editingSessao?.resultados || "",
    status: editingSessao?.status || ("realizada" as const),
    tipo_profissional: "neuropsicologia", // Novo campo
    medicacao: "", // Novo campo
  })

  // Áreas de desenvolvimento
  const [areasDesenvolvimento, setAreasDesenvolvimento] = useState<AreasDesenvolvimento>({
    comportamental: {
      observacoes: "",
      nivel: "3",
      agitacao: "baixa",
      rigidez: "flexivel",
    },
    emocional: {
      observacoes: "",
      nivel: "3",
      estado_humor: "estavel",
      regulacao: "adequada",
    },
    motora: {
      observacoes: "",
      nivel: "3",
      coordenacao_fina: "adequada",
      coordenacao_grossa: "adequada",
    },
    cognitiva: {
      observacoes: "",
      nivel: "3",
      atencao: "adequada",
      memoria: "adequada",
      raciocinio: "adequado",
    },
    comunicacao: {
      observacoes: "",
      nivel: "3",
      verbal: "adequada",
      nao_verbal: "adequada",
      compreensao: "adequada",
    },
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.data_sessao) {
      newErrors.data_sessao = "Data e hora da sessão são obrigatórias"
    }

    if (!formData.duracao) {
      newErrors.duracao = "Duração é obrigatória"
    } else {
      const duracao = Number.parseInt(formData.duracao)
      if (duracao < 15 || duracao > 240) {
        newErrors.duracao = "Duração deve estar entre 15 e 240 minutos"
      }
    }

    if (formData.status === "realizada" && !formData.objetivos.trim()) {
      newErrors.objetivos = "Objetivos são obrigatórios para sessões realizadas"
    }

    if (formData.status === "realizada" && !formData.observacoes.trim()) {
      newErrors.observacoes = "Observações são obrigatórias para sessões realizadas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Consolidar dados das áreas de desenvolvimento nas observações
      const observacoesCompletas = `
${formData.observacoes}

=== ÁREAS DE DESENVOLVIMENTO ===

COMPORTAMENTAL (Nível ${areasDesenvolvimento.comportamental.nivel}/5):
- Agitação: ${areasDesenvolvimento.comportamental.agitacao}
- Rigidez: ${areasDesenvolvimento.comportamental.rigidez}
- Observações: ${areasDesenvolvimento.comportamental.observacoes}

EMOCIONAL (Nível ${areasDesenvolvimento.emocional.nivel}/5):
- Estado de humor: ${areasDesenvolvimento.emocional.estado_humor}
- Regulação: ${areasDesenvolvimento.emocional.regulacao}
- Observações: ${areasDesenvolvimento.emocional.observacoes}

MOTORA (Nível ${areasDesenvolvimento.motora.nivel}/5):
- Coordenação fina: ${areasDesenvolvimento.motora.coordenacao_fina}
- Coordenação grossa: ${areasDesenvolvimento.motora.coordenacao_grossa}
- Observações: ${areasDesenvolvimento.motora.observacoes}

COGNITIVA (Nível ${areasDesenvolvimento.cognitiva.nivel}/5):
- Atenção: ${areasDesenvolvimento.cognitiva.atencao}
- Memória: ${areasDesenvolvimento.cognitiva.memoria}
- Raciocínio: ${areasDesenvolvimento.cognitiva.raciocinio}
- Observações: ${areasDesenvolvimento.cognitiva.observacoes}

COMUNICAÇÃO (Nível ${areasDesenvolvimento.comunicacao.nivel}/5):
- Verbal: ${areasDesenvolvimento.comunicacao.verbal}
- Não-verbal: ${areasDesenvolvimento.comunicacao.nao_verbal}
- Compreensão: ${areasDesenvolvimento.comunicacao.compreensao}
- Observações: ${areasDesenvolvimento.comunicacao.observacoes}

PROFISSIONAL: ${formData.tipo_profissional}
${formData.medicacao ? `MEDICAÇÃO: ${formData.medicacao}` : ""}
      `.trim()

      const sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em"> = {
        paciente_id: pacienteId,
        data_sessao: new Date(formData.data_sessao).toISOString(),
        duracao: Number.parseInt(formData.duracao),
        observacoes: observacoesCompletas,
        objetivos: formData.objetivos.trim(),
        resultados: formData.resultados.trim(),
        status: formData.status,
      }

      onSubmit(sessao)

      toast({
        title: editingSessao ? "Sessão atualizada!" : "Sessão registrada!",
        description: editingSessao
          ? "As informações da sessão foram atualizadas com sucesso."
          : "A nova sessão foi registrada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar sessão:", error)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a sessão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAreaChange = (area: keyof AreasDesenvolvimento, field: string, value: string) => {
    setAreasDesenvolvimento((prev) => ({
      ...prev,
      [area]: {
        ...prev[area],
        [field]: value,
      },
    }))
  }

  const getNivelColor = (nivel: string) => {
    const n = Number.parseInt(nivel)
    if (n <= 2) return "text-red-600"
    if (n === 3) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_sessao">Data e Hora *</Label>
              <Input
                id="data_sessao"
                type="datetime-local"
                value={formData.data_sessao}
                onChange={(e) => handleInputChange("data_sessao", e.target.value)}
                className={errors.data_sessao ? "border-red-500" : ""}
                required
              />
              {errors.data_sessao && <p className="text-sm text-red-600">{errors.data_sessao}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (min) *</Label>
              <Select value={formData.duracao} onValueChange={(value) => handleInputChange("duracao", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                  <SelectItem value="120">120 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_profissional">Tipo de Profissional</Label>
              <Select
                value={formData.tipo_profissional}
                onValueChange={(value) => handleInputChange("tipo_profissional", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neuropsicologia">Neuropsicologia</SelectItem>
                  <SelectItem value="psicologia">Psicologia</SelectItem>
                  <SelectItem value="pedagogia">Pedagogia</SelectItem>
                  <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
                  <SelectItem value="terapia_ocupacional">Terapia Ocupacional</SelectItem>
                  <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicacao">Medicação (nome, dosagem, efeitos)</Label>
              <Input
                id="medicacao"
                placeholder="Ex: Ritalina 10mg - melhora na atenção"
                value={formData.medicacao}
                onChange={(e) => handleInputChange("medicacao", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Desenvolvimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Áreas de Desenvolvimento
          </CardTitle>
          <CardDescription>Avalie o desenvolvimento em cada área (1=Muito Baixo, 5=Excelente)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comportamental" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="comportamental" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Comportamental
              </TabsTrigger>
              <TabsTrigger value="emocional" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Emocional
              </TabsTrigger>
              <TabsTrigger value="motora" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Motora
              </TabsTrigger>
              <TabsTrigger value="cognitiva" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                Cognitiva
              </TabsTrigger>
              <TabsTrigger value="comunicacao" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Comunicação
              </TabsTrigger>
            </TabsList>

            {/* Comportamental */}
            <TabsContent value="comportamental" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nível Geral</Label>
                  <Select
                    value={areasDesenvolvimento.comportamental.nivel}
                    onValueChange={(value) => handleAreaChange("comportamental", "nivel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Agitação</Label>
                  <Select
                    value={areasDesenvolvimento.comportamental.agitacao}
                    onValueChange={(value) => handleAreaChange("comportamental", "agitacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rigidez Comportamental</Label>
                  <Select
                    value={areasDesenvolvimento.comportamental.rigidez}
                    onValueChange={(value) => handleAreaChange("comportamental", "rigidez", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexivel">Flexível</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="rigida">Rígida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações Comportamentais</Label>
                <Textarea
                  placeholder="Descreva comportamentos observados, interações, reações..."
                  value={areasDesenvolvimento.comportamental.observacoes}
                  onChange={(e) => handleAreaChange("comportamental", "observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Emocional */}
            <TabsContent value="emocional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nível Geral</Label>
                  <Select
                    value={areasDesenvolvimento.emocional.nivel}
                    onValueChange={(value) => handleAreaChange("emocional", "nivel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado de Humor</Label>
                  <Select
                    value={areasDesenvolvimento.emocional.estado_humor}
                    onValueChange={(value) => handleAreaChange("emocional", "estado_humor", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alegre">Alegre</SelectItem>
                      <SelectItem value="estavel">Estável</SelectItem>
                      <SelectItem value="irritado">Irritado</SelectItem>
                      <SelectItem value="triste">Triste</SelectItem>
                      <SelectItem value="ansioso">Ansioso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Regulação Emocional</Label>
                  <Select
                    value={areasDesenvolvimento.emocional.regulacao}
                    onValueChange={(value) => handleAreaChange("emocional", "regulacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="dificuldade">Com Dificuldade</SelectItem>
                      <SelectItem value="inadequada">Inadequada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações Emocionais</Label>
                <Textarea
                  placeholder="Descreva estado emocional, reações, regulação..."
                  value={areasDesenvolvimento.emocional.observacoes}
                  onChange={(e) => handleAreaChange("emocional", "observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Motora */}
            <TabsContent value="motora" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nível Geral</Label>
                  <Select
                    value={areasDesenvolvimento.motora.nivel}
                    onValueChange={(value) => handleAreaChange("motora", "nivel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Coordenação Fina</Label>
                  <Select
                    value={areasDesenvolvimento.motora.coordenacao_fina}
                    onValueChange={(value) => handleAreaChange("motora", "coordenacao_fina", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="dificuldade">Com Dificuldade</SelectItem>
                      <SelectItem value="inadequada">Inadequada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Coordenação Grossa</Label>
                  <Select
                    value={areasDesenvolvimento.motora.coordenacao_grossa}
                    onValueChange={(value) => handleAreaChange("motora", "coordenacao_grossa", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="dificuldade">Com Dificuldade</SelectItem>
                      <SelectItem value="inadequada">Inadequada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações Motoras</Label>
                <Textarea
                  placeholder="Descreva habilidades motoras, coordenação, equilíbrio..."
                  value={areasDesenvolvimento.motora.observacoes}
                  onChange={(e) => handleAreaChange("motora", "observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Cognitiva */}
            <TabsContent value="cognitiva" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Nível Geral</Label>
                  <Select
                    value={areasDesenvolvimento.cognitiva.nivel}
                    onValueChange={(value) => handleAreaChange("cognitiva", "nivel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Atenção</Label>
                  <Select
                    value={areasDesenvolvimento.cognitiva.atencao}
                    onValueChange={(value) => handleAreaChange("cognitiva", "atencao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="dispersa">Dispersa</SelectItem>
                      <SelectItem value="inadequada">Inadequada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Memória</Label>
                  <Select
                    value={areasDesenvolvimento.cognitiva.memoria}
                    onValueChange={(value) => handleAreaChange("cognitiva", "memoria", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="dificuldade">Com Dificuldade</SelectItem>
                      <SelectItem value="inadequada">Inadequada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Raciocínio</Label>
                  <Select
                    value={areasDesenvolvimento.cognitiva.raciocinio}
                    onValueChange={(value) => handleAreaChange("cognitiva", "raciocinio", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequado">Adequado</SelectItem>
                      <SelectItem value="dificuldade">Com Dificuldade</SelectItem>
                      <SelectItem value="inadequado">Inadequado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações Cognitivas</Label>
                <Textarea
                  placeholder="Descreva capacidades cognitivas, atenção, memória, raciocínio..."
                  value={areasDesenvolvimento.cognitiva.observacoes}
                  onChange={(e) => handleAreaChange("cognitiva", "observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Comunicação */}
            <TabsContent value="comunicacao" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Nível Geral</Label>
                  <Select
                    value={areasDesenvolvimento.comunicacao.nivel}
                    onValueChange={(value) => handleAreaChange("comunicacao", "nivel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Comunicação Verbal</Label>
                  <Select
                    value={areasDesenvolvimento.comunicacao.verbal}
                    onValueChange={(value) => handleAreaChange("comunicacao", "verbal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="limitada">Limitada</SelectItem>
                      <SelectItem value="ausente">Ausente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Comunicação Não-Verbal</Label>
                  <Select
                    value={areasDesenvolvimento.comunicacao.nao_verbal}
                    onValueChange={(value) => handleAreaChange("comunicacao", "nao_verbal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="limitada">Limitada</SelectItem>
                      <SelectItem value="ausente">Ausente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Compreensão</Label>
                  <Select
                    value={areasDesenvolvimento.comunicacao.compreensao}
                    onValueChange={(value) => handleAreaChange("comunicacao", "compreensao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequada">Adequada</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="limitada">Limitada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações de Comunicação</Label>
                <Textarea
                  placeholder="Descreva habilidades de comunicação, linguagem, expressão..."
                  value={areasDesenvolvimento.comunicacao.observacoes}
                  onChange={(e) => handleAreaChange("comunicacao", "observacoes", e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Objetivos e Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos e Resultados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos da Sessão {formData.status === "realizada" && "*"}</Label>
            <Textarea
              id="objetivos"
              placeholder="Descreva os objetivos trabalhados nesta sessão..."
              value={formData.objetivos}
              onChange={(e) => handleInputChange("objetivos", e.target.value)}
              className={errors.objetivos ? "border-red-500" : ""}
              rows={3}
            />
            {errors.objetivos && <p className="text-sm text-red-600">{errors.objetivos}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Gerais {formData.status === "realizada" && "*"}</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações gerais sobre a sessão..."
              value={formData.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              className={errors.observacoes ? "border-red-500" : ""}
              rows={3}
            />
            {errors.observacoes && <p className="text-sm text-red-600">{errors.observacoes}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultados">Resultados Obtidos</Label>
            <Textarea
              id="resultados"
              placeholder="Descreva os resultados e progressos observados..."
              value={formData.resultados}
              onChange={(e) => handleInputChange("resultados", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {editingSessao ? "Atualizando..." : "Salvando..."}
            </>
          ) : editingSessao ? (
            "Atualizar Sessão"
          ) : (
            "Salvar Sessão"
          )}
        </Button>
      </div>
    </form>
  )
}
