"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPacientes, getAcompanhamentoPedagogico, type Paciente, type AcompanhamentoPedagogico } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap, Loader2, FileText, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AlunoLaudado extends Paciente {
  ultimo_registro?: AcompanhamentoPedagogico
}

export default function VisaoPedagogicaPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [alunos, setAlunos] = useState<AlunoLaudado[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: pacientes } = await getPacientes(user!.id)
      
      if (pacientes) {
        // Para cada paciente, buscar o último registro pedagógico
        const alunosComRegistros = await Promise.all(
          pacientes.map(async (p) => {
            const { data } = await getAcompanhamentoPedagogico(p.id)
            return {
              ...p,
              ultimo_registro: data && data.length > 0 ? data[0] : undefined
            }
          })
        )
        setAlunos(alunosComRegistros)
      }
    } catch (err) {
      console.error("Erro ao carregar visão pedagógica:", err)
    } finally {
      setLoading(false)
    }
  }

  // Agrupar alunos por série
  const alunosFiltrados = alunos.filter(a => 
    a.nome.toLowerCase().includes(search.toLowerCase()) || 
    (a.serie && a.serie.toLowerCase().includes(search.toLowerCase()))
  )

  const gruposPorSerie = alunosFiltrados.reduce((acc, aluno) => {
    const serie = aluno.serie || "Série Não Informada"
    if (!acc[serie]) acc[serie] = []
    acc[serie].push(aluno)
    return acc
  }, {} as Record<string, AlunoLaudado[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão Pedagógica (CSM)</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhamento consolidado de alunos laudados por série</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar aluno ou série..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {Object.entries(gruposPorSerie).map(([serie, lista]) => (
        <Card key={serie} className="border-l-4 border-l-blue-600">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <CardTitle className="text-lg flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
              {serie}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 border">Estudante</th>
                    <th className="px-4 py-3 border">Diagnóstico</th>
                    <th className="px-4 py-3 border w-1/3">Aspectos Positivos / Habilidades</th>
                    <th className="px-4 py-3 border w-1/3">Habilidades Necessárias (Metas)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lista.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-4 border font-medium">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-400" />
                          {aluno.nome}
                        </div>
                      </td>
                      <td className="px-4 py-4 border text-center">
                        <Badge variant="outline" className="text-xs font-normal">
                          {aluno.diagnostico || "---"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 border text-xs text-gray-700 dark:text-gray-300">
                        {aluno.ultimo_registro?.aspectos_positivos || (
                          <span className="text-gray-400 italic">Sem registros recentes</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border text-xs text-gray-700 dark:text-gray-300">
                        {aluno.ultimo_registro?.metas_desenvolvimento || (
                          <span className="text-gray-400 italic">---</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.keys(gruposPorSerie).length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Nenhum aluno encontrado</h3>
          <p className="text-gray-500">Cadastre a escola e série no perfil do aluno para vê-los aqui.</p>
        </div>
      )}
    </div>
  )
}
