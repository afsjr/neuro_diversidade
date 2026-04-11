"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Loader2, Target, Info, HelpCircle } from "lucide-react"
import { createPlano, type Paciente } from "@/lib/supabase"
import { getAIPlanoRecommendation, AIRecommendation } from "@/lib/ai-service"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface NovoPlanoFormProps {
  paciente: Paciente
  onSuccess: () => void
  onCancel: () => void
}

export function NovoPlanoForm({ paciente, onSuccess, onCancel }: NovoPlanoFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_inicio: new Date().toISOString().split("T")[0],
    data_fim: "",
    status: "ativo" as "ativo" | "concluido" | "pausado",
  })

  const [aiJustificativa, setAiJustificativa] = useState<string | null>(null)

  const handleAIRecommendation = async () => {
    setLoadingAI(true)
    try {
      const recommendation = await getAIPlanoRecommendation(paciente)
      setFormData({
        ...formData,
        titulo: recommendation.titulo,
        descricao: `${recommendation.descricao}\n\nObjetivos sugeridos:\n${recommendation.objetivos.map(o => `• ${o}`).join("\n")}`,
      })
      setAiJustificativa(recommendation.justificativa)
      toast({
        title: "Sugestão da IA Gerada",
        description: "Plano sugerido com base no diagnóstico e perfil do paciente.",
      })
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: "Não foi possível gerar a recomendação.",
        variant: "destructive",
      })
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await createPlano({
        paciente_id: paciente.id,
        titulo: formData.titulo,
        descricao: formData.descricao,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim || null,
        status: formData.status,
      })

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Plano de tratamento criado com sucesso.",
      })
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erro ao criar plano",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cadastrar Novo Plano</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100"
          onClick={handleAIRecommendation}
          disabled={loadingAI}
        >
          {loadingAI ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Sugerir com IA
        </Button>
        <InfoTooltip 
          className="ml-2" 
          content="O Co-piloto Clínico sugere objetivos baseados em protocolos de neurodesenvolvimento (ABA, TCC, etc), potencializando sua análise mas sempre sob sua supervisão e validação humana." 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Plano *</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Ex: Treino de Comunicação Alternativa"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_inicio">Data de Início *</Label>
          <Input
            id="data_inicio"
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_fim">Data de Término (Opcional)</Label>
          <Input
            id="data_fim"
            type="date"
            value={formData.data_fim}
            onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição e Objetivos *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva o plano terapêutico e as metas esperadas..."
          className="min-h-[150px]"
          required
        />
      </div>

      {aiJustificativa && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
          <p className="text-xs text-blue-700">
            <strong>Justificativa da IA:</strong> {aiJustificativa}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Plano"}
        </Button>
      </div>
    </form>
  )
}
