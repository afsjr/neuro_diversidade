"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, GraduationCap, Calendar, Trash2, FileText, Loader2, Sparkles } from "lucide-react"
import { getAcompanhamentoPedagogico, createAcompanhamentoPedagogico, deleteAcompanhamentoPedagogico, type AcompanhamentoPedagogico } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { InfoTooltip } from "@/components/ui/info-tooltip"

interface PedagogicoTabProps {
  pacienteId: string
}

export function PedagogicoTab({ pacienteId }: PedagogicoTabProps) {
  const { toast } = useToast()
  const [registros, setRegistros] = useState<AcompanhamentoPedagogico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    professor_nome: "",
    turma: "",
    aspectos_positivos: "",
    metas_desenvolvimento: "",
    observacoes_gerais: "",
    data_registro: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadRegistros()
  }, [pacienteId])

  const loadRegistros = async () => {
    try {
      setLoading(true)
      const { data, error } = await getAcompanhamentoPedagogico(pacienteId)
      if (error) throw error
      setRegistros(data || [])
    } catch (err) {
      console.error("Erro ao carregar registros pedagógicos:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await createAcompanhamentoPedagogico({
        paciente_id: pacienteId,
        ...formData
      })
      if (error) throw error
      
      toast({ title: "Sucesso", description: "Registro pedagógico salvo com sucesso." })
      setShowForm(false)
      setFormData({
        professor_nome: "",
        turma: "",
        aspectos_positivos: "",
        metas_desenvolvimento: "",
        observacoes_gerais: "",
        data_registro: new Date().toISOString().split("T")[0],
      })
      loadRegistros()
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Falha ao salvar registro.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este registro pedagógico?")) return
    try {
      const { error } = await deleteAcompanhamentoPedagogico(id)
      if (error) throw error
      setRegistros(registros.filter(r => r.id !== id))
      toast({ title: "Excluído", description: "Registro removido com sucesso." })
    } catch (err) {
      toast({ title: "Erro", description: "Não foi possível excluir o registro.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Acompanhamento Pedagógico (Padrão CSM)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Integração entre desenvolvimento clínico e escolar</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-blue-100 bg-blue-50/30 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="text-md flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
              Novo Acompanhamento Estudantil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professor">Professor(a) *</Label>
                  <Input 
                    id="professor" 
                    value={formData.professor_nome} 
                    onChange={(e) => setFormData({...formData, professor_nome: e.target.value})}
                    placeholder="Nome do docente"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turma">Turma/Série *</Label>
                  <Input 
                    id="turma" 
                    value={formData.turma} 
                    onChange={(e) => setFormData({...formData, turma: e.target.value})}
                    placeholder="Ex: Infantil 5 - Manhã"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data de Referência *</Label>
                  <Input 
                    id="data" 
                    type="date"
                    value={formData.data_registro} 
                    onChange={(e) => setFormData({...formData, data_registro: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="positivos">Aspectos Positivos / Habilidades Desenvolvidas</Label>
                  <InfoTooltip content="Descreva o que a criança já realiza com autonomia, seus pontos fortes e interesses. Conforme padrão CSM." />
                </div>
                <Textarea 
                  id="positivos" 
                  value={formData.aspectos_positivos} 
                  onChange={(e) => setFormData({...formData, aspectos_positivos: e.target.value})}
                  placeholder="Criança comunicativa, interage bem com colegas..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="metas">Habilidades que Necessitam ser Desenvolvidas</Label>
                  <InfoTooltip content="Metas pedagógicas: foco, persistência frente a desafios, autonomia em tarefas escolares, etc." />
                </div>
                <Textarea 
                  id="metas" 
                  value={formData.metas_desenvolvimento} 
                  onChange={(e) => setFormData({...formData, metas_desenvolvimento: e.target.value})}
                  placeholder="Melhorar controle emocional diante de frustrações, reduzir dispersão..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Salvar Registro
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : registros.length > 0 ? (
          registros.map((reg) => (
            <Card key={reg.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Prof. {reg.professor_nome}</CardTitle>
                      <CardDescription className="text-xs">{reg.turma}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(reg.data_registro).toLocaleDateString("pt-BR")}
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(reg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-green-600 flex items-center">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Aspectos Positivos
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reg.aspectos_positivos}</p>
                </div>
                <div className="space-y-2 border-l pl-6 border-dashed">
                  <h4 className="text-xs font-bold uppercase text-orange-600 flex items-center">
                    <FileText className="mr-1 h-3 w-3" />
                    Metas de Desenvolvimento
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reg.metas_desenvolvimento}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-gray-500">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Nenhum registro pedagógico encontrado.</p>
              <p className="text-sm">Comece integrando as observações da escola.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function Save(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}
