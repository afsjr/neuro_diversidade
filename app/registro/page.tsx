"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Brain, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function RegistroPage() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    crp: "",
    especialidade: "",
    senha: "",
    confirmarSenha: "",
    aceitaTermos: false,
    aceitaPrivacidade: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres"
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // Validação do CRP
    if (!formData.crp.trim()) {
      newErrors.crp = "CRP é obrigatório"
    } else if (!/^\d{2}\/\d{5,6}$/.test(formData.crp)) {
      newErrors.crp = "CRP deve estar no formato XX/XXXXX"
    }

    // Validação da senha
    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória"
    } else if (formData.senha.length < 8) {
      newErrors.senha = "Senha deve ter pelo menos 8 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      newErrors.senha = "Senha deve conter ao menos uma letra maiúscula, minúscula e um número"
    }

    // Validação da confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória"
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem"
    }

    // Validação dos termos
    if (!formData.aceitaTermos) {
      newErrors.aceitaTermos = "Você deve aceitar os termos de uso"
    }

    if (!formData.aceitaPrivacidade) {
      newErrors.aceitaPrivacidade = "Você deve aceitar a política de privacidade"
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
      const result = await signUp(formData.email, formData.senha, formData.nome, formData.especialidade)

      if (result.success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você foi registrado e redirecionado para o dashboard.",
        })
      } else {
        toast({
          title: "Erro ao criar conta",
          description: result.error || "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCRP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 7) {
      const formatted = numbers.replace(/(\d{2})(\d{5,6})/, "$1/$2")
      return formatted
    }
    return value
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Criar Conta</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Junte-se ao NeuroAcompanha Pro</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Registro</CardTitle>
            <CardDescription>Preencha seus dados para criar uma conta profissional</CardDescription>
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
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className={errors.nome ? "border-red-500" : ""}
                    />
                    {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", formatTelefone(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crp">CRP *</Label>
                    <Input
                      id="crp"
                      placeholder="06/123456"
                      value={formData.crp}
                      onChange={(e) => handleInputChange("crp", formatCRP(e.target.value))}
                      className={errors.crp ? "border-red-500" : ""}
                    />
                    {errors.crp && <p className="text-sm text-red-600">{errors.crp}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Select
                    value={formData.especialidade}
                    onValueChange={(value) => handleInputChange("especialidade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuropsicologia">Neuropsicologia</SelectItem>
                      <SelectItem value="psicologia-clinica">Psicologia Clínica</SelectItem>
                      <SelectItem value="psicologia-escolar">Psicologia Escolar</SelectItem>
                      <SelectItem value="terapia-ocupacional">Terapia Ocupacional</SelectItem>
                      <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
                      <SelectItem value="psicopedagogia">Psicopedagogia</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Segurança */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Segurança</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.senha}
                        onChange={(e) => handleInputChange("senha", e.target.value)}
                        className={errors.senha ? "border-red-500" : ""}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.senha && <p className="text-sm text-red-600">{errors.senha}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input
                        id="confirmarSenha"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmarSenha}
                        onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                        className={errors.confirmarSenha ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmarSenha && <p className="text-sm text-red-600">{errors.confirmarSenha}</p>}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, minúscula e um número.
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Termos e Condições</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="aceitaTermos"
                      checked={formData.aceitaTermos}
                      onCheckedChange={(checked) => handleInputChange("aceitaTermos", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="aceitaTermos"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceito os{" "}
                        <Link href="/termos" className="text-blue-600 hover:underline">
                          Termos de Uso
                        </Link>
                      </Label>
                    </div>
                  </div>
                  {errors.aceitaTermos && <p className="text-sm text-red-600">{errors.aceitaTermos}</p>}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="aceitaPrivacidade"
                      checked={formData.aceitaPrivacidade}
                      onCheckedChange={(checked) => handleInputChange("aceitaPrivacidade", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="aceitaPrivacidade"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceito a{" "}
                        <Link href="/privacidade" className="text-blue-600 hover:underline">
                          Política de Privacidade
                        </Link>
                      </Label>
                    </div>
                  </div>
                  {errors.aceitaPrivacidade && <p className="text-sm text-red-600">{errors.aceitaPrivacidade}</p>}
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta?{" "}
                    <Link href="/" className="text-blue-600 hover:underline font-medium">
                      Fazer login
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
