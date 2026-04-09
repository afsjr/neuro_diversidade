"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MarcoDesenvolvimento } from "@/lib/supabase"

interface MarcoFormProps {
  pacienteId: string
  onSubmit: (marco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em">) => void
  onCancel: () => void
}

export function MarcoForm({ pacienteId, onSubmit, onCancel }: MarcoFormProps) {
  const [formData, setFormData] = useState({
    categoria: "",
    titulo: "",
    descricao: "",
    data_alcancado: "",
    status: "pendente" as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const marco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em"> = {
      paciente_id: pacienteId,
      categoria: formData.categoria,
      titulo: formData.titulo,
      descricao: formData.descricao,
      data_alcancado: formData.data_alcancado || undefined,
      status: formData.status,
    }

    onSubmit(marco)
  }

  const categorias = ["Comunicação", "Social", "Motor", "Cognitivo", "Comportamental", "Autocuidado", "Acadêmico"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_progresso">Em Progresso</SelectItem>
              <SelectItem value="alcancado">Alcançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Marco</Label>
        <Input
          id="titulo"
          placeholder="Ex: Primeira palavra funcional"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          placeholder="Descreva detalhadamente o marco de desenvolvimento..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          rows={3}
        />
      </div>

      {formData.status === "alcancado" && (
        <div className="space-y-2">
          <Label htmlFor="data_alcancado">Data Alcançada</Label>
          <Input
            id="data_alcancado"
            type="date"
            value={formData.data_alcancado}
            onChange={(e) => setFormData({ ...formData, data_alcancado: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Marco</Button>
      </div>
    </form>
  )
}
