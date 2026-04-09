"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Settings, Shield, Save } from "lucide-react"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Estados para as configurações
  const [perfilConfig, setPerfilConfig] = useState({
    nome: "Dr. Exemplo",
    email: "dr.exemplo@email.com",
    telefone: "(11) 99999-9999",
    especialidade: "Neuropsicologia",
    crp: "06/123456",
  })

  const [notificacoesConfig, setNotificacoesConfig] = useState({
    emailSessoes: true,
    emailRelatorios: false,
    pushAgendamentos: true,
    pushMarcos: true,
    resumoDiario: true,
  })

  const [sistemaConfig, setSistemaConfig] = useState({
    tema: "system",
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    formatoData: "dd/MM/yyyy",
    backupAutomatico: true,
  })

  const [segurancaConfig, setSegurancaConfig] = useState({
    autenticacaoDupla: false,
    sessaoExpira: "8",
    logAcesso: true,
    criptografiaDados: true,
  })

  const handleSalvarPerfil = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações de perfil foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalvarNotificacoes = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notificações atualizadas!",
        description: "Suas preferências de notificação foram salvas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalvarSistema = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Sistema atualizado!",
        description: "As configurações do sistema foram salvas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalvarSeguranca = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Segurança atualizada!",
        description: "As configurações de segurança foram salvas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Aba Perfil */}
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais e profissionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={perfilConfig.nome}
                    onChange={(e) => setPerfilConfig({ ...perfilConfig, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfilConfig.email}
                    onChange={(e) => setPerfilConfig({ ...perfilConfig, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={perfilConfig.telefone}
                    onChange={(e) => setPerfilConfig({ ...perfilConfig, telefone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp">CRP</Label>
                  <Input
                    id="crp"
                    value={perfilConfig.crp}
                    onChange={(e) => setPerfilConfig({ ...perfilConfig, crp: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={perfilConfig.especialidade}
                  onChange={(e) => setPerfilConfig({ ...perfilConfig, especialidade: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvarPerfil} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Perfil"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como e quando você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações por Email</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmação de Sessões</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba emails quando sessões forem agendadas ou canceladas
                    </p>
                  </div>
                  <Switch
                    checked={notificacoesConfig.emailSessoes}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({ ...notificacoesConfig, emailSessoes: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Semanais</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba um resumo semanal do progresso dos pacientes
                    </p>
                  </div>
                  <Switch
                    checked={notificacoesConfig.emailRelatorios}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({ ...notificacoesConfig, emailRelatorios: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações Push</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembretes de Agendamentos</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba lembretes 30 minutos antes das sessões
                    </p>
                  </div>
                  <Switch
                    checked={notificacoesConfig.pushAgendamentos}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({ ...notificacoesConfig, pushAgendamentos: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marcos Alcançados</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seja notificado quando pacientes alcançarem novos marcos
                    </p>
                  </div>
                  <Switch
                    checked={notificacoesConfig.pushMarcos}
                    onCheckedChange={(checked) => setNotificacoesConfig({ ...notificacoesConfig, pushMarcos: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resumo Diário</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba um resumo das atividades do dia</p>
                  </div>
                  <Switch
                    checked={notificacoesConfig.resumoDiario}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({ ...notificacoesConfig, resumoDiario: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvarNotificacoes} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Notificações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Sistema */}
        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Personalize a aparência e comportamento do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema</Label>
                  <Select
                    value={sistemaConfig.tema}
                    onValueChange={(value) => setSistemaConfig({ ...sistemaConfig, tema: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select
                    value={sistemaConfig.idioma}
                    onValueChange={(value) => setSistemaConfig({ ...sistemaConfig, idioma: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={sistemaConfig.timezone}
                    onValueChange={(value) => setSistemaConfig({ ...sistemaConfig, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formatoData">Formato de Data</Label>
                  <Select
                    value={sistemaConfig.formatoData}
                    onValueChange={(value) => setSistemaConfig({ ...sistemaConfig, formatoData: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Automático</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fazer backup automático dos dados diariamente
                  </p>
                </div>
                <Switch
                  checked={sistemaConfig.backupAutomatico}
                  onCheckedChange={(checked) => setSistemaConfig({ ...sistemaConfig, backupAutomatico: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvarSistema} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Sistema"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta e dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch
                  checked={segurancaConfig.autenticacaoDupla}
                  onCheckedChange={(checked) => setSegurancaConfig({ ...segurancaConfig, autenticacaoDupla: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessaoExpira">Expiração da Sessão (horas)</Label>
                <Select
                  value={segurancaConfig.sessaoExpira}
                  onValueChange={(value) => setSegurancaConfig({ ...segurancaConfig, sessaoExpira: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Log de Acesso</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manter registro de todos os acessos à conta
                  </p>
                </div>
                <Switch
                  checked={segurancaConfig.logAcesso}
                  onCheckedChange={(checked) => setSegurancaConfig({ ...segurancaConfig, logAcesso: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Criptografia de Dados</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Criptografar dados sensíveis dos pacientes</p>
                </div>
                <Switch
                  checked={segurancaConfig.criptografiaDados}
                  onCheckedChange={(checked) => setSegurancaConfig({ ...segurancaConfig, criptografiaDados: checked })}
                />
              </div>

              <div className="space-y-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Alterar Senha</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Recomendamos alterar sua senha regularmente para manter sua conta segura.
                </p>
                <Button variant="outline" size="sm">
                  Alterar Senha
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvarSeguranca} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Segurança"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
