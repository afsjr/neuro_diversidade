"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"

interface TesteRota {
  nome: string
  rota: string
  descricao: string
  status: "sucesso" | "erro" | "pendente"
  testado: boolean
}

export default function TesteNavegacaoPage() {
  const [rotas, setRotas] = useState<TesteRota[]>([
    {
      nome: "Dashboard Principal",
      rota: "/dashboard",
      descricao: "Página principal com visão geral dos pacientes",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente Ana Silva",
      rota: "/dashboard/pacientes/1",
      descricao: "Perfil completo da paciente Ana Silva",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente João Santos",
      rota: "/dashboard/pacientes/2",
      descricao: "Perfil completo do paciente João Santos",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente Beatriz Costa",
      rota: "/dashboard/pacientes/3",
      descricao: "Perfil completo da paciente Beatriz Costa",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente Pedro Oliveira",
      rota: "/dashboard/pacientes/4",
      descricao: "Perfil completo do paciente Pedro Oliveira",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente Sofia Mendes",
      rota: "/dashboard/pacientes/5",
      descricao: "Perfil completo da paciente Sofia Mendes (inativa)",
      status: "pendente",
      testado: false,
    },
    {
      nome: "Paciente Lucas Ferreira",
      rota: "/dashboard/pacientes/6",
      descricao: "Perfil completo do paciente Lucas Ferreira (alta)",
      status: "pendente",
      testado: false,
    },
  ])

  const marcarComoTestado = (index: number, sucesso: boolean) => {
    setRotas((prev) =>
      prev.map((rota, i) =>
        i === index
          ? {
              ...rota,
              testado: true,
              status: sucesso ? "sucesso" : "erro",
            }
          : rota,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sucesso":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "erro":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sucesso":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "erro":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  const rotasTestadas = rotas.filter((r) => r.testado).length
  const rotasSucesso = rotas.filter((r) => r.status === "sucesso").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teste de Navegação</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Teste todas as rotas do aplicativo para verificar se estão funcionando corretamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{rotas.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Rotas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{rotasTestadas}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rotas Testadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{rotasSucesso}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rotas Funcionando</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rotas para Teste</CardTitle>
          <CardDescription>Clique em cada rota para testá-la e marque se está funcionando corretamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rotas.map((rota, index) => (
              <div key={rota.rota} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(rota.status)}
                  <div>
                    <h3 className="font-medium">{rota.nome}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rota.descricao}</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{rota.rota}</code>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(rota.status)}>
                    {rota.status === "sucesso" ? "Funcionando" : rota.status === "erro" ? "Com Erro" : "Não Testado"}
                  </Badge>
                  <Link href={rota.rota} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Testar
                    </Button>
                  </Link>
                  {!rota.testado && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => marcarComoTestado(index, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✓
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => marcarComoTestado(index, false)}>
                        ✗
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades das Abas</CardTitle>
          <CardDescription>Teste as funcionalidades dentro de cada perfil de paciente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Aba Perfil</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Visualizar informações pessoais</li>
                <li>• Dados do responsável</li>
                <li>• Informações clínicas</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Aba Sessões</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Listar sessões realizadas</li>
                <li>• Adicionar nova sessão</li>
                <li>• Visualizar detalhes das sessões</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Aba Marcos</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Visualizar marcos por categoria</li>
                <li>• Adicionar novo marco</li>
                <li>• Acompanhar status dos marcos</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Aba Planos</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Visualizar planos de tratamento</li>
                <li>• Status dos planos</li>
                <li>• Datas de início e fim</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Aba Progresso</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Gráfico de evolução</li>
                <li>• Filtro por categoria</li>
                <li>• Detalhes das avaliações</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
