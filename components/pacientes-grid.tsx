"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getPacientes, isSupabaseConfigured, type Paciente } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, User, Calendar, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PacientesGrid() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadPacientes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = pacientes.filter(
        (paciente) =>
          paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (paciente.diagnostico && paciente.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredPacientes(filtered)
    } else {
      setFilteredPacientes(pacientes)
    }
  }, [searchTerm, pacientes])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured()) {
        setError("Banco de dados não configurado")
        return
      }

      const usuarioId = "00000000-0000-0000-0000-000000000000"
      const { data, error: supabaseError } = await getPacientes(usuarioId)

      if (supabaseError) {
        setError(supabaseError.message)
        toast({
          title: "Erro ao carregar pacientes",
          description: supabaseError.message,
          variant: "destructive",
        })
        return
      }

      setPacientes(data || [])
      setFilteredPacientes(data || [])
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error)
      setError("Erro inesperado ao carregar pacientes")
      toast({
        title: "Erro ao carregar pacientes",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inativo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "alta":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
            <p className="text-gray-600 dark:text-gray-400">Gerencie seus pacientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
            <p className="text-gray-600 dark:text-gray-400">Gerencie seus pacientes</p>
          </div>
          <Link href="/dashboard/pacientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar pacientes</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            <button onClick={loadPacientes} className="mt-2 text-sm underline hover:no-underline">
              Tentar novamente
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {pacientes.length === 0
              ? "Nenhum paciente cadastrado"
              : `${pacientes.length} paciente${pacientes.length !== 1 ? "s" : ""} cadastrado${pacientes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/dashboard/pacientes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </Link>
      </div>

      {pacientes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {!isSupabaseConfigured() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo Demonstração</AlertTitle>
          <AlertDescription>
            O banco de dados não está configurado. Os dados mostrados são apenas para demonstração.
          </AlertDescription>
        </Alert>
      )}

      {pacientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum paciente cadastrado</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Comece adicionando seu primeiro paciente para começar a acompanhar o desenvolvimento.
            </p>
            <Link href="/dashboard/pacientes/novo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Paciente
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPacientes.map((paciente) => (
            <Card key={paciente.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{paciente.nome}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {calculateAge(paciente.data_nascimento)} anos
                    </p>
                  </div>
                  <Badge className={getStatusColor(paciente.status)}>{paciente.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="mr-2 h-4 w-4" />
                    {paciente.responsavel}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(paciente.data_nascimento)}
                  </div>
                  {paciente.telefone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="mr-2 h-4 w-4" />
                      {paciente.telefone}
                    </div>
                  )}
                  {paciente.diagnostico && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Diagnóstico:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{paciente.diagnostico}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href={`/dashboard/pacientes/${paciente.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPacientes.length === 0 && searchTerm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Não encontramos pacientes que correspondam à sua busca por "{searchTerm}".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
