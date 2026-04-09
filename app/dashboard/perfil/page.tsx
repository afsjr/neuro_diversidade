"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Camera, Save, User, Mail, Phone, MapPin, Calendar, Award } from "lucide-react"

export default function PerfilPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [perfilData, setPerfilData] = useState({
    nome: "Dr. Exemplo",
    email: "dr.exemplo@email.com",
    telefone: "(11) 99999-9999",
    endereco: "São Paulo, SP",
    especialidade: "Neuropsicologia",
    crp: "06/123456",
    formacao: "Psicologia - USP",
    experiencia: "10 anos",
    bio: "Especialista em neuropsicologia com foco em desenvolvimento infantil e transtornos do neurodesenvolvimento.",
    dataIngresso: "2020-01-15",
  })

  const estatisticas = {
    totalPacientes: 6,
    sessoesRealizadas: 124,
    marcosAlcancados: 45,
    tempoMedio: "60 min",
  }

  const handleSalvar = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as informações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = () => {
    setIsEditing(false)
    // Resetar dados se necessário
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400">Visualize e edite suas informações pessoais e profissionais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Informações do Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Principal do Perfil */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informações Pessoais</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancelar}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvar} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar e Informações Básicas */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-lg">DR</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold">{perfilData.nome}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{perfilData.especialidade}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">CRP: {perfilData.crp}</Badge>
                    <Badge variant="outline">{perfilData.experiencia} de experiência</Badge>
                  </div>
                </div>
              </div>

              {/* Formulário de Edição */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="nome"
                      value={perfilData.nome}
                      onChange={(e) => setPerfilData({ ...perfilData, nome: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{perfilData.nome}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={perfilData.email}
                      onChange={(e) => setPerfilData({ ...perfilData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{perfilData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="telefone"
                      value={perfilData.telefone}
                      onChange={(e) => setPerfilData({ ...perfilData, telefone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{perfilData.telefone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Localização</Label>
                  {isEditing ? (
                    <Input
                      id="endereco"
                      value={perfilData.endereco}
                      onChange={(e) => setPerfilData({ ...perfilData, endereco: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{perfilData.endereco}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  {isEditing ? (
                    <Input
                      id="especialidade"
                      value={perfilData.especialidade}
                      onChange={(e) => setPerfilData({ ...perfilData, especialidade: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span>{perfilData.especialidade}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crp">CRP</Label>
                  {isEditing ? (
                    <Input
                      id="crp"
                      value={perfilData.crp}
                      onChange={(e) => setPerfilData({ ...perfilData, crp: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <span className="text-sm font-medium">CRP:</span>
                      <span>{perfilData.crp}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia Profissional</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    rows={4}
                    value={perfilData.bio}
                    onChange={(e) => setPerfilData({ ...perfilData, bio: e.target.value })}
                    placeholder="Descreva sua experiência e especialidades..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 py-2">{perfilData.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card de Formação e Experiência */}
          <Card>
            <CardHeader>
              <CardTitle>Formação e Experiência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Formação Acadêmica</Label>
                  <p className="text-gray-700 dark:text-gray-300">{perfilData.formacao}</p>
                </div>
                <div className="space-y-2">
                  <Label>Tempo de Experiência</Label>
                  <p className="text-gray-700 dark:text-gray-300">{perfilData.experiencia}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Membro desde</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(perfilData.dataIngresso).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Estatísticas */}
        <div className="space-y-6">
          {/* Estatísticas Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Resumo da sua atividade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{estatisticas.totalPacientes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{estatisticas.sessoesRealizadas}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Sessões</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{estatisticas.marcosAlcancados}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Marcos</div>
                </div>
              </div>

              <div className="text-center pt-2 border-t">
                <div className="text-lg font-semibold text-orange-600">{estatisticas.tempoMedio}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Duração Média</div>
              </div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle>Conquistas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">100 Sessões</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completadas com sucesso</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">50 Marcos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Alcançados pelos pacientes</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">1 Ano</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Usando o sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
