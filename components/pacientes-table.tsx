"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search, MoreHorizontal, Eye, Edit, Phone, Mail, Calendar, X } from "lucide-react"
import { calculateAge, formatDate } from "@/lib/utils"
import type { Paciente } from "@/lib/supabase"

interface PacientesTableProps {
  pacientes: Paciente[]
  isLoading?: boolean
}

type SortField = "nome" | "data_nascimento" | "responsavel" | "status" | "diagnostico"
type SortDirection = "asc" | "desc"

export function PacientesTable({ pacientes, isLoading }: PacientesTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("nome")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Função para ordenar
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Dados filtrados e ordenados
  const filteredAndSortedPacientes = useMemo(() => {
    const filtered = pacientes.filter((paciente) => {
      const matchesSearch =
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (paciente.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (paciente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesStatus = statusFilter === "all" || paciente.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "nome":
          aValue = a.nome
          bValue = b.nome
          break
        case "data_nascimento":
          aValue = new Date(a.data_nascimento).getTime()
          bValue = new Date(b.data_nascimento).getTime()
          break
        case "responsavel":
          aValue = a.responsavel
          bValue = b.responsavel
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "diagnostico":
          aValue = a.diagnostico || ""
          bValue = b.diagnostico || ""
          break
        default:
          aValue = a.nome
          bValue = b.nome
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortDirection === "asc" ? comparison : -comparison
      } else {
        const comparison = (aValue as number) - (bValue as number)
        return sortDirection === "asc" ? comparison : -comparison
      }
    })

    return filtered
  }, [pacientes, searchTerm, statusFilter, sortField, sortDirection])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        )
      case "inativo":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Inativo
          </Badge>
        )
      case "alta":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Alta
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setSortField("nome")
    setSortDirection("asc")
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
        </div>
        <div className="border rounded-lg">
          <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b last:border-b-0 bg-gray-50 dark:bg-gray-900 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, responsável, diagnóstico ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
          {(searchTerm || statusFilter !== "all") && (
            <Button variant="outline" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Total: {filteredAndSortedPacientes.length} pacientes</span>
        <span>•</span>
        <span>Ativos: {filteredAndSortedPacientes.filter((p) => p.status === "ativo").length}</span>
        <span>•</span>
        <span>Inativos: {filteredAndSortedPacientes.filter((p) => p.status === "inativo").length}</span>
        <span>•</span>
        <span>Alta: {filteredAndSortedPacientes.filter((p) => p.status === "alta").length}</span>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[200px]">
                  <Button variant="ghost" onClick={() => handleSort("nome")} className="h-auto p-0 font-semibold">
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("data_nascimento")}
                    className="h-auto p-0 font-semibold"
                  >
                    Idade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[180px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("responsavel")}
                    className="h-auto p-0 font-semibold"
                  >
                    Responsável
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell w-[200px]">Contato</TableHead>
                <TableHead className="hidden lg:table-cell w-[200px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("diagnostico")}
                    className="h-auto p-0 font-semibold"
                  >
                    Diagnóstico
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 font-semibold">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPacientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== "all"
                      ? "Nenhum paciente encontrado com os filtros aplicados"
                      : "Nenhum paciente cadastrado"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPacientes.map((paciente) => (
                  <TableRow
                    key={paciente.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/dashboard/pacientes/${paciente.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{paciente.nome}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(paciente.data_nascimento)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{calculateAge(paciente.data_nascimento)} anos</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{paciente.responsavel}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        {paciente.telefone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {paciente.telefone}
                          </div>
                        )}
                        {paciente.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {paciente.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{paciente.diagnostico || "Não informado"}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(paciente.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/pacientes/${paciente.id}`)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/pacientes/${paciente.id}?tab=perfil`)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
