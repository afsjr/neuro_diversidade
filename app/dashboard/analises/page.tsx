"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnaliseGeral } from "@/components/analises/analise-geral"
import { AnalisePaciente } from "@/components/analises/analise-paciente"
import { AnaliseComparativa } from "@/components/analises/analise-comparativa"
import { AnaliseTendencias } from "@/components/analises/analise-tendencias"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

export default function AnalisesPage() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("3meses")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Análises</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights detalhados sobre o progresso dos pacientes e eficácia dos tratamentos
          </p>
        </div>
        <div className="w-48">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mes">Último mês</SelectItem>
              <SelectItem value="3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="1ano">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Melhoria</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">+23%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Crescimento</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">15</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Marcos Alcançados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análises */}
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Análise Geral</TabsTrigger>
          <TabsTrigger value="paciente">Por Paciente</TabsTrigger>
          <TabsTrigger value="comparativa">Comparativa</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <AnaliseGeral periodo={periodoSelecionado} />
        </TabsContent>

        <TabsContent value="paciente">
          <AnalisePaciente periodo={periodoSelecionado} />
        </TabsContent>

        <TabsContent value="comparativa">
          <AnaliseComparativa periodo={periodoSelecionado} />
        </TabsContent>

        <TabsContent value="tendencias">
          <AnaliseTendencias periodo={periodoSelecionado} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
