"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, Users, Calendar } from "lucide-react"
import { RelatorioSessoes } from "@/components/relatorios/relatorio-sessoes"
import { RelatorioPacientes } from "@/components/relatorios/relatorio-pacientes"
import { RelatorioProgresso } from "@/components/relatorios/relatorio-progresso"
import { RelatorioFinanceiro } from "@/components/relatorios/relatorio-financeiro"

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState("sessoes")

  const handleExportPDF = () => {
    // Implementar exportação para PDF
    console.log("Exportando relatório para PDF...")
  }

  const handleExportExcel = () => {
    // Implementar exportação para Excel
    console.log("Exportando relatório para Excel...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e exporte relatórios detalhados sobre seus pacientes e atividades
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessões este mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de progresso</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Relatórios gerados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
          <TabsTrigger value="progresso">Progresso</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="sessoes">
          <RelatorioSessoes />
        </TabsContent>

        <TabsContent value="pacientes">
          <RelatorioPacientes />
        </TabsContent>

        <TabsContent value="progresso">
          <RelatorioProgresso />
        </TabsContent>

        <TabsContent value="financeiro">
          <RelatorioFinanceiro />
        </TabsContent>
      </Tabs>
    </div>
  )
}
