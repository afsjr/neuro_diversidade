"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"

export default function NovoPacientePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    responsavel: "",
    telefone: "",
    email: "",
    diagnostico: "",
    observacoes: "",
    status: "ativo" as const,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.data_nascimento) {
      newErrors.data_nascimento = "Data de nascimento é obrigatória"
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = "Nome do responsável é obrigatório"
    }

    if (formData.telefone && !/^$$\d{2}$$\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = "Formato de telefone inválido. Use (11) 99999-9999"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
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
      // Simular salvamento no banco de dados
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Paciente cadastrado!",
        description: "O novo paciente foi cadastrado com sucesso.",
      })

      // Redirecionar para o dashboard ou para o perfil do paciente
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o paciente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      const formatted = numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
      return formatted
    }
    return value
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Novo Paciente</h1>
          <p className="text-gray-600 dark:text-gray-400">Cadastre um novo paciente no sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informações do Paciente</span>
          </CardTitle>
          <CardDescription>Preencha todas as informações necessárias para o cadastro</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Pessoais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo do paciente"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange("data_nascimento", e.target.value)}
                    className={errors.data_nascimento ? "border-red-500" : ""}
                  />
                  {errors.data_nascimento && <p className="text-sm text-red-600">{errors.data_nascimento}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Input
                  id="diagnostico"
                  placeholder="Ex: TEA, TDAH, Síndrome de Down..."
                  value={formData.diagnostico}
                  onChange={(e) => handleInputChange("diagnostico", e.target.value)}
                />
              </div>
            </div>

            {/* Informações do Responsável */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações do Responsável</h3>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Nome do Responsável *</Label>
                <Input
                  id="responsavel"
                  placeholder="Nome completo do responsável"
                  value={formData.responsavel}
                  onChange={(e) => handleInputChange("responsavel", e.target.value)}
                  className={errors.responsavel ? "border-red-500" : ""}
                />
                {errors.responsavel && <p className="text-sm text-red-600">{errors.responsavel}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", formatTelefone(e.target.value))}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && <p className="text-sm text-red-600">{errors.telefone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Adicionais</h3>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações gerais sobre o paciente..."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Link href="/dashboard">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar Paciente"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
