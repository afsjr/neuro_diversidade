"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Phone, Mail, Edit, ArrowLeft } from "lucide-react"
import { getPacienteById, type Paciente } from "@/lib/supabase"
import { calculateAge, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PacienteHeaderProps {
  pacienteId: string
}

export function PacienteHeader({ pacienteId }: PacienteHeaderProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPaciente()
  }, [pacienteId])

  const loadPaciente = async () => {
    try {
      setLoading(true)
      const { data, error } = await getPacienteById(pacienteId)

      if (error) {
        throw new Error(error.message)
      }

      setPaciente(data)
    } catch (error: any) {
      console.error("Erro ao carregar paciente:", error)
      toast({
        title: "Erro ao carregar paciente",
        description: error.message || "Não foi possível carregar os dados do paciente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!paciente) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-gray-500 dark:text-gray-400">Paciente não encontrado</p>
            <p className="text-sm text-gray-400">ID buscado: {pacienteId}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Pacientes disponíveis:</p>
              <div className="text-xs text-gray-500">Verifique se o ID está correto ou acesse a lista de pacientes</div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/dashboard/pacientes">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Lista
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Ir para Dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inativo":
        return <Badge className="bg-yellow-100 text-yellow-800">Inativo</Badge>
      case "alta":
        return <Badge className="bg-blue-100 text-blue-800">Alta</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">{paciente.nome}</CardTitle>
              <CardDescription className="flex items-center space-x-4 mt-1">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {calculateAge(paciente.data_nascimento)} anos
                </span>
                <span>•</span>
                <span>{formatDate(paciente.data_nascimento)}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(paciente.status)}
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsável</h4>
            <p className="text-gray-600 dark:text-gray-400">{paciente.responsavel}</p>
          </div>
          {paciente.telefone && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contato</h4>
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {paciente.telefone}
                </p>
                {paciente.email && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {paciente.email}
                  </p>
                )}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Diagnóstico</h4>
            <p className="text-gray-600 dark:text-gray-400">{paciente.diagnostico || "Não informado"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
