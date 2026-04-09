"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Agendamento {
  paciente_id: string
  paciente_nome: string
  data: string
  hora: string
  duracao: number
  tipo: "consulta" | "sessao" | "avaliacao"
  status: "agendado" | "confirmado" | "realizado" | "cancelado"
  observacoes?: string
}

interface NovoAgendamentoFormProps {
  onSubmit: (agendamento: Agendamento) => void
  onCancel: () => void
}

// Pacientes de exemplo para o select
const pacientesExemplo = [
  { id: "1", nome: "Ana Silva" },
  { id: "2", nome: "João Santos" },
  { id: "3", nome: "Beatriz Costa" },
  { id: "4", nome: "Pedro Oliveira" },
  { id: "5", nome: "Sofia Mendes" },
  { id: "6", nome: "Lucas Ferreira" },
]

export function NovoAgendamentoForm({ onSubmit, onCancel }: NovoAgendamentoFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    paciente_id: "",
    data: "",
    hora: "",
    duracao: "60",
    tipo: "sessao" as const,
    status: "agendado" as const,
    observacoes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.paciente_id || !formData.data || !formData.hora) {
      toast({
        title: "Erro na validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const pacienteSelecionado = pacientesExemplo.find((p) => p.id === formData.paciente_id)

      const agendamento: Agendamento = {
        ...formData,
        paciente_nome: pacienteSelecionado?.nome || "",
        duracao: Number.parseInt(formData.duracao),
      }

      onSubmit(agendamento)

      toast({
        title: "Agendamento criado!",
        description: "O agendamento foi criado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar agendamento",
        description: "Ocorreu um erro ao criar o agendamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paciente">Paciente *</Label>
          <Select
            value={formData.paciente_id}
            onValueChange={(value) => setFormData({ ...formData, paciente_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um paciente" />
            </SelectTrigger>
            <SelectContent>
              {pacientesExemplo.map((paciente) => (
                <SelectItem key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Atendimento</Label>
          <Select value={formData.tipo} onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consulta">Consulta</SelectItem>
              <SelectItem value="sessao">Sessão de Terapia</SelectItem>
              <SelectItem value="avaliacao">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data *</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hora">Hora *</Label>
          <Input
            id="hora"
            type="time"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duracao">Duração (minutos)</Label>
          <Select value={formData.duracao} onValueChange={(value) => setFormData({ ...formData, duracao: value })}>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Observações sobre o agendamento..."
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Salvando...
            </>
          ) : (
            "Criar Agendamento"
          )}
        </Button>
      </div>
    </form>
  )
}
