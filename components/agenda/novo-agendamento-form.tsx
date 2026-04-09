"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getPacientes } from "@/lib/supabase"

interface NovoAgendamentoFormProps {
  onSubmit: (agendamento: any) => void
  onCancel: () => void
}

export function NovoAgendamentoForm({ onSubmit, onCancel }: NovoAgendamentoFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pacientes, setPacientes] = useState<{ id: string, nome: string }[]>([])
  const [loadingPacientes, setLoadingPacientes] = useState(true)

  const [formData, setFormData] = useState({
    paciente_id: "",
    data: "",
    hora: "",
    duracao: "60",
    tipo: "sessao" as const,
    status: "agendado" as const,
    observacoes: "",
  })

  useEffect(() => {
    if (user) {
      loadPacientes()
    }
  }, [user])

  const loadPacientes = async () => {
    try {
      setLoadingPacientes(true)
      const { data, error } = await getPacientes(user!.id)
      if (error) throw error
      setPacientes(data || [])
    } catch (err) {
      console.error("Erro ao carregar pacientes para agendamento:", err)
    } finally {
      setLoadingPacientes(false)
    }
  }

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
      const agendamento = {
        ...formData,
        duracao: parseInt(formData.duracao),
      }
      await onSubmit(agendamento)
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
            disabled={loadingPacientes}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingPacientes ? "Carregando..." : "Selecione um paciente"} />
            </SelectTrigger>
            <SelectContent>
              {pacientes.map((paciente) => (
                <SelectItem key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </SelectItem>
              ))}
              {pacientes.length === 0 && !loadingPacientes && (
                <SelectItem value="none" disabled>Nenhum paciente encontrado</SelectItem>
              )}
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
          {isSubmitting ? "Salvando..." : "Criar Agendamento"}
        </Button>
      </div>
    </form>
  )
}
