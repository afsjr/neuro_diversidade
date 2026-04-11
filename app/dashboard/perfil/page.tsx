"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { updateUsuario, getDashboardStats, getConquistasUsuario, type Conquista } from "@/lib/supabase"
import { Camera, Save, User, Mail, Phone, MapPin, Calendar, Award, Loader2, Trophy } from "lucide-react"
import { BadgesGrid } from "@/components/badges-grid"

export default function PerfilPage() {
  const { user, usuarioData, refreshUsuarioData } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conquistas, setConquistas] = useState<Conquista[]>([])
  const [stats, setStats] = useState({
    pacientes: 0,
    sessoes: 0,
    marcos: 0,
    marcosAlcancados: 0,
  })

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    especialidade: "",
    crp: "",
    formacao: "",
    experiencia: "",
    bio: "",
  })

  useEffect(() => {
    if (usuarioData) {
      setFormData({
        nome: usuarioData.nome || "",
        email: usuarioData.email || "",
        telefone: usuarioData.telefone || "",
        endereco: usuarioData.endereco || "",
        especialidade: usuarioData.especialidade || "",
        crp: usuarioData.crp || "",
        formacao: usuarioData.formacao || "",
        experiencia: usuarioData.experiencia || "",
        bio: usuarioData.bio || "",
      })
    }
  }, [usuarioData])

  const loadData = useCallback(async () => {
    if (user) {
      const [statsData, conquistasData] = await Promise.all([
        getDashboardStats(user.id),
        getConquistasUsuario(user.id)
      ])
      setStats(statsData)
      setConquistas(conquistasData.data || [])
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSalvar = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { error } = await updateUsuario(user.id, formData)
      if (error) throw error
      
      await refreshUsuarioData()
      setIsEditing(false)
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as informações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = () => {
    if (usuarioData) {
      setFormData({
        nome: usuarioData.nome || "",
        email: usuarioData.email || "",
        telefone: usuarioData.telefone || "",
        endereco: usuarioData.endereco || "",
        especialidade: usuarioData.especialidade || "",
        crp: usuarioData.crp || "",
        formacao: usuarioData.formacao || "",
        experiencia: usuarioData.experiencia || "",
        bio: usuarioData.bio || "",
      })
    }
    setIsEditing(false)
  }

  if (!usuarioData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400">Visualize e edite suas informações pessoais e profissionais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informações Pessoais</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancelar} disabled={isLoading}>
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
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={usuarioData.avatar_url || "/placeholder-user.jpg"} />
                    <AvatarFallback className="text-lg">
                      {formData.nome ? formData.nome.substring(0, 2).toUpperCase() : "DR"}
                    </AvatarFallback>
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
                  <h3 className="text-xl font-semibold">{formData.nome || "Novo usuário"}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{formData.especialidade || "Especialidade não informada"}</p>
                  <div className="flex items-center space-x-2">
                    {formData.crp && <Badge variant="secondary">CRP: {formData.crp}</Badge>}
                    {formData.experiencia && <Badge variant="outline">{formData.experiencia} de experiência</Badge>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{formData.nome}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formData.telefone || "Não informado"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Localização</Label>
                  {isEditing ? (
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.endereco || "Não informado"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  {isEditing ? (
                    <Input
                      id="especialidade"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span>{formData.especialidade || "Não informada"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crp">CRP</Label>
                  {isEditing ? (
                    <Input
                      id="crp"
                      value={formData.crp}
                      onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <span className="text-sm font-medium">CRP:</span>
                      <span>{formData.crp || "Não informado"}</span>
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
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Descreva sua experiência e especialidades..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 py-2">{formData.bio || "Nenhuma biografia informada"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formação e Experiência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formacao">Formação Acadêmica</Label>
                  {isEditing ? (
                    <Input
                      id="formacao"
                      value={formData.formacao}
                      onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{formData.formacao || "Não informada"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experiencia">Tempo de Experiência</Label>
                  {isEditing ? (
                    <Input
                      id="experiencia"
                      value={formData.experiencia}
                      onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{formData.experiencia || "Não informada"}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Membro desde</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(usuarioData.criado_em).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Resumo da sua atividade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.pacientes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.sessoes}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Sessões</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.marcosAlcancados}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Marcos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Minhas Conquistas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BadgesGrid conquistas={conquistas} />
              {conquistas.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">
                  Em busca das primeiras conquistas profissionais!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
